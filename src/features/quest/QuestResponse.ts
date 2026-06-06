import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import colors from "@utils/colors";
import CommonResponse from "@features/common/CommonResponse";
import type { ApplyRewardsResult } from "./questRewards";
import {
  DAILY_MISSION_GOLD,
  DAILY_MISSION_XP,
  IDLE_QUEST_GOLD,
  IDLE_QUEST_XP,
} from "./questRewards";
import type { DailyBoard, DailyMissionStatus } from "./QuestService";
import type { DailyMissionId } from "./questMissions";

export default class QuestResponse {
  static buildDailyBoard(board: DailyBoard) {
    const embed = new EmbedBuilder()
      .setTitle("Daily Missions")
      .setColor(colors.sky)
      .setDescription(`UTC date: **${board.date}** — resets at midnight UTC`);

    const rows: ActionRowBuilder<ButtonBuilder>[] = [];
    const claimRow = new ActionRowBuilder<ButtonBuilder>();

    board.missions.forEach((mission) => {
      embed.addFields({
        name: `${this._missionEmoji(mission)} ${mission.name}`,
        value: `${mission.description}\n${this._missionStatus(mission)}`,
      });

      if (mission.completed && !mission.claimed) {
        claimRow.addComponents(
          new ButtonBuilder()
            .setCustomId(`quest:daily:claim:${mission.id}`)
            .setLabel(`Claim #${mission.id}`)
            .setStyle(ButtonStyle.Success)
        );
      }
    });

    if (claimRow.components.length) rows.push(claimRow);

    return { embed, rows };
  }

  static buildUnregistered() {
    return CommonResponse.buildUnregisteredResponse();
  }

  static buildClaimResult(
    missionId: DailyMissionId,
    progression: ApplyRewardsResult
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Mission Claimed!")
      .setColor(colors.sky)
      .setDescription(
        [
          `**${this._missionName(missionId)}** rewards collected.`,
          `+${DAILY_MISSION_XP} XP · +${DAILY_MISSION_GOLD} gold`,
          progression.levelsGained
            ? `**Level up!** You are now level **${progression.level}**.`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      );

    return embed;
  }

  static buildClaimError(reason: "incomplete" | "already_claimed") {
    const messages = {
      incomplete: "This mission is not complete yet.",
      already_claimed: "You already claimed this mission today.",
    };

    return CommonResponse.buildErrorResponse().setDescription(
      messages[reason]
    );
  }

  static buildIdleStarted(endsAt: Date) {
    return new EmbedBuilder()
      .setTitle("Expedition Started")
      .setColor(colors.sky)
      .setDescription(
        [
          "Your idle expedition is underway.",
          `Returns around <t:${Math.floor(endsAt.getTime() / 1000)}:R>.`,
          `Reward: +${IDLE_QUEST_XP} XP · +${IDLE_QUEST_GOLD} gold`,
        ].join("\n")
      );
  }

  static buildIdleInProgress(endsAt: Date) {
    return new EmbedBuilder()
      .setTitle("Expedition In Progress")
      .setColor(colors.sky)
      .setDescription(
        `Your party is still exploring. Come back <t:${Math.floor(endsAt.getTime() / 1000)}:R>.`
      );
  }

  static buildIdleClaimResult(progression: ApplyRewardsResult) {
    return new EmbedBuilder()
      .setTitle("Expedition Complete!")
      .setColor(colors.sky)
      .setDescription(
        [
          `+${IDLE_QUEST_XP} XP · +${IDLE_QUEST_GOLD} gold`,
          progression.levelsGained
            ? `**Level up!** You are now level **${progression.level}**.`
            : null,
        ]
          .filter(Boolean)
          .join("\n")
      );
  }

  static buildIdleNotReady(endsAt: Date) {
    return new EmbedBuilder()
      .setTitle("Not Ready Yet")
      .setColor(colors.sky)
      .setDescription(
        `Your expedition finishes <t:${Math.floor(endsAt.getTime() / 1000)}:R>.`
      );
  }

  static buildIdleNone() {
    return CommonResponse.buildErrorResponse().setDescription(
      "No expedition to claim. Start one with **/quest idle start**."
    );
  }

  static buildStoryStub() {
    return new EmbedBuilder()
      .setTitle("Chapter 1 — The Shimmering Gate")
      .setColor(colors.sky)
      .setDescription(
        "A rift has opened at the edge of the realm. Rally your squad, exploit elemental weaknesses, and push back the encroaching shadow."
      )
      .addFields(
        {
          name: "Roadmap",
          value: [
            "• Elemental combat (Water › Earth › Wind › Fire)",
            "• Squad battles with up to 6 heroes",
            "• Chapter rewards: XP, gold, and exclusive loot",
          ].join("\n"),
        },
        {
          name: "Status",
          value: "Combat system — in development",
        }
      )
      .setFooter({ text: "Combat system — in development" });
  }

  private static _missionStatus(mission: DailyMissionStatus) {
    if (mission.claimed) return "✅ Claimed";
    if (mission.completed) return "🎁 Ready to claim";
    return "⏳ In progress";
  }

  private static _missionEmoji(mission: DailyMissionStatus) {
    if (mission.claimed) return "✅";
    if (mission.completed) return "🎁";
    return "⏳";
  }

  private static _missionName(id: DailyMissionId) {
    const names: Record<DailyMissionId, string> = {
      1: "Scout the realm",
      2: "Study the grimoire",
      3: "Begin an expedition",
    };

    return names[id];
  }
}
