import BaseModel from "@base/BaseModel";
import { models } from "@lib/database";
import { LogicalException } from "@exception/index";
import { getUtcDateString } from "./questMissions";
import {
  applyRewards,
  DAILY_MISSION_GOLD,
  DAILY_MISSION_XP,
  IDLE_QUEST_GOLD,
  IDLE_QUEST_XP,
  IDLE_DURATION_MS,
  type ApplyRewardsResult,
  type RewardGrant,
} from "./questRewards";
import type { DailyMissionId } from "./questMissions";

export default class QuestModel extends BaseModel {
  protected name = "QuestModel";
  protected _model = models.dailyQuestProgress;

  get dailyModel() {
    if (!this._model) {
      throw new LogicalException(`${this.name}: daily model not initialized.`);
    }

    return this._model;
  }

  get idleModel() {
    return models.idleQuest;
  }

  get userModel() {
    return models.user;
  }

  async getUserByDiscordId(discordId: string) {
    return await this.userModel.findUnique({ where: { discordId } });
  }

  async getOrCreateDailyProgress(userId: string, date = getUtcDateString()) {
    const existing = await this.dailyModel.findUnique({
      where: { userId_date: { userId, date } },
    });

    if (existing) return existing;

    return await this.dailyModel.create({
      data: { userId, date },
    });
  }

  async completeMission(userId: string, missionId: DailyMissionId) {
    const progress = await this.getOrCreateDailyProgress(userId);
    const field = `mission${missionId}Completed` as const;

    if (progress[field]) return progress;

    return await this.dailyModel.update({
      where: { id: progress.id },
      data: { [field]: true },
    });
  }

  async claimMission(userId: string, missionId: DailyMissionId) {
    const progress = await this.getOrCreateDailyProgress(userId);
    const completedField = `mission${missionId}Completed` as const;
    const claimedField = `mission${missionId}Claimed` as const;

    if (!progress[completedField]) {
      return { ok: false as const, reason: "incomplete" as const };
    }

    if (progress[claimedField]) {
      return { ok: false as const, reason: "already_claimed" as const };
    }

    await this.dailyModel.update({
      where: { id: progress.id },
      data: { [claimedField]: true },
    });

    const progression = await this.grantRewards(userId, {
      xp: DAILY_MISSION_XP,
      gold: DAILY_MISSION_GOLD,
    });

    return { ok: true as const, progression };
  }

  async getActiveIdleQuest(userId: string) {
    return await this.idleModel.findUnique({
      where: { userId },
    });
  }

  async startIdleQuest(userId: string) {
    const existing = await this.getActiveIdleQuest(userId);
    const now = new Date();

    if (existing && !existing.claimed && existing.endsAt > now) {
      return {
        ok: false as const,
        reason: "in_progress" as const,
        endsAt: existing.endsAt,
      };
    }

    if (existing) {
      await this.idleModel.delete({ where: { userId } });
    }

    const startedAt = now;
    const endsAt = new Date(now.getTime() + IDLE_DURATION_MS);

    const idle = await this.idleModel.create({
      data: { userId, startedAt, endsAt },
    });

    return { ok: true as const, idle };
  }

  async claimIdleQuest(userId: string) {
    const idle = await this.getActiveIdleQuest(userId);
    const now = new Date();

    if (!idle || idle.claimed) {
      return { ok: false as const, reason: "none" as const };
    }

    if (idle.endsAt > now) {
      return {
        ok: false as const,
        reason: "not_ready" as const,
        endsAt: idle.endsAt,
      };
    }

    await this.idleModel.update({
      where: { userId },
      data: { claimed: true },
    });

    const progression = await this.grantRewards(userId, {
      xp: IDLE_QUEST_XP,
      gold: IDLE_QUEST_GOLD,
    });

    return { ok: true as const, progression };
  }

  async grantRewards(
    userId: string,
    reward: RewardGrant
  ): Promise<ApplyRewardsResult> {
    const user = await this.userModel.findUniqueOrThrow({
      where: { id: userId },
    });

    const result = applyRewards(
      {
        level: user.level,
        xp: user.xp,
        nextXp: user.nextXp,
        gold: user.gold,
      },
      reward
    );

    await this.userModel.update({
      where: { id: userId },
      data: {
        level: result.level,
        xp: result.xp,
        nextXp: result.nextXp,
        gold: result.gold,
      },
    });

    return result;
  }

  async create() {}
  async update() {}
  async delete() {}
}
