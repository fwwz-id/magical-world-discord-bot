import QuestModel from "./QuestModel";
import { DAILY_MISSIONS, type DailyMissionId } from "./questMissions";
import type { ApplyRewardsResult } from "./questRewards";
import type { DailyQuestProgress, IdleQuest } from "@prisma/client";

export type DailyMissionStatus = {
  id: DailyMissionId;
  name: string;
  description: string;
  completed: boolean;
  claimed: boolean;
};

export type DailyBoard = {
  date: string;
  missions: DailyMissionStatus[];
};

export default class QuestService {
  private model = new QuestModel();

  async requireUser(discordId: string) {
    return await this.model.getUserByDiscordId(discordId);
  }

  async getDailyBoard(discordId: string): Promise<DailyBoard | null> {
    const user = await this.requireUser(discordId);
    if (!user) return null;

    const progress = await this.model.getOrCreateDailyProgress(user.id);
    return this._toDailyBoard(progress);
  }

  async trackMission(discordId: string, missionId: DailyMissionId) {
    const user = await this.requireUser(discordId);
    if (!user) return null;

    return await this.model.completeMission(user.id, missionId);
  }

  async claimDailyMission(
    discordId: string,
    missionId: DailyMissionId
  ): Promise<
    | { ok: false; reason: "unregistered" | "incomplete" | "already_claimed" }
    | { ok: true; progression: ApplyRewardsResult; missionId: DailyMissionId }
  > {
    const user = await this.requireUser(discordId);
    if (!user) return { ok: false, reason: "unregistered" };

    const result = await this.model.claimMission(user.id, missionId);

    if (!result.ok) return result;

    return { ok: true, progression: result.progression, missionId };
  }

  async startIdle(discordId: string) {
    const user = await this.requireUser(discordId);
    if (!user) return { ok: false as const, reason: "unregistered" as const };

    const result = await this.model.startIdleQuest(user.id);

    if (result.ok) {
      await this.model.completeMission(user.id, 3);
    }

    return result;
  }

  async claimIdle(discordId: string) {
    const user = await this.requireUser(discordId);
    if (!user) return { ok: false as const, reason: "unregistered" as const };

    return await this.model.claimIdleQuest(user.id);
  }

  private _toDailyBoard(progress: DailyQuestProgress): DailyBoard {
    const missions = DAILY_MISSIONS.map((mission) => ({
      id: mission.id,
      name: mission.name,
      description: mission.description,
      completed: progress[`mission${mission.id}Completed`],
      claimed: progress[`mission${mission.id}Claimed`],
    }));

    return { date: progress.date, missions };
  }
}

export type IdleStartResult =
  | { ok: false; reason: "unregistered" }
  | { ok: false; reason: "in_progress"; endsAt: Date }
  | { ok: true; idle: IdleQuest };

export type IdleClaimResult =
  | { ok: false; reason: "unregistered" | "none" }
  | { ok: false; reason: "not_ready"; endsAt: Date }
  | { ok: true; progression: ApplyRewardsResult };
