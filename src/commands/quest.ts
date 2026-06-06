import {
  type ButtonInteraction,
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import BaseCommand from "@base/BaseCommand";
import QuestService from "@features/quest/QuestService";
import QuestResponse from "@features/quest/QuestResponse";
import type { DailyMissionId } from "@features/quest/questMissions";

const questService = new QuestService();

class QuestCommand extends BaseCommand {
  data() {
    return new SlashCommandBuilder()
      .setName("quest")
      .setDescription("Quest board and expeditions")
      .addSubcommand((sub) =>
        sub.setName("daily").setDescription("View daily missions and claim rewards")
      )
      .addSubcommandGroup((group) =>
        group
          .setName("idle")
          .setDescription("Idle expedition rewards")
          .addSubcommand((sub) =>
            sub
              .setName("start")
              .setDescription("Start a one-hour idle expedition")
          )
          .addSubcommand((sub) =>
            sub.setName("claim").setDescription("Claim idle expedition rewards")
          )
      )
      .addSubcommand((sub) =>
        sub
          .setName("story")
          .setDescription("Preview story mode and roadmap")
      );
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const subcommandGroup = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === "idle") {
      if (subcommand === "start") {
        await this._handleIdleStart(interaction);
        return;
      }

      if (subcommand === "claim") {
        await this._handleIdleClaim(interaction);
        return;
      }
    }

    if (subcommand === "daily") {
      await this._handleDaily(interaction);
      return;
    }

    if (subcommand === "story") {
      await interaction.reply({
        embeds: [QuestResponse.buildStoryStub()],
      });
    }
  }

  async handleDailyClaimButton(interaction: ButtonInteraction) {
    const parts = interaction.customId.split(":");
    const missionId = Number(parts[3]) as DailyMissionId;

    if (![1, 2, 3].includes(missionId)) {
      await interaction.reply({
        embeds: [QuestResponse.buildClaimError("incomplete")],
        ephemeral: true,
      });
      return;
    }

    const result = await questService.claimDailyMission(
      interaction.user.id,
      missionId
    );

    if (!result.ok) {
      if (result.reason === "unregistered") {
        await interaction.reply({
          embeds: [QuestResponse.buildUnregistered()],
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        embeds: [QuestResponse.buildClaimError(result.reason)],
        ephemeral: true,
      });
      return;
    }

    const board = await questService.getDailyBoard(interaction.user.id);
    const claimEmbed = QuestResponse.buildClaimResult(
      missionId,
      result.progression
    );

    if (board) {
      const { embed, rows } = QuestResponse.buildDailyBoard(board);

      await interaction.update({
        embeds: [embed, claimEmbed],
        components: rows.length ? rows : [],
      });
      return;
    }

    await interaction.reply({
      embeds: [claimEmbed],
      ephemeral: true,
    });
  }

  private async _handleDaily(interaction: ChatInputCommandInteraction) {
    const board = await questService.getDailyBoard(interaction.user.id);

    if (!board) {
      return await interaction.reply({
        embeds: [QuestResponse.buildUnregistered()],
      });
    }

    const { embed, rows } = QuestResponse.buildDailyBoard(board);

    await interaction.reply({
      embeds: [embed],
      components: rows.length ? rows : undefined,
    });
  }

  private async _handleIdleStart(interaction: ChatInputCommandInteraction) {
    const result = await questService.startIdle(interaction.user.id);

    if (!result.ok) {
      if (result.reason === "unregistered") {
        return await interaction.reply({
          embeds: [QuestResponse.buildUnregistered()],
        });
      }

      return await interaction.reply({
        embeds: [QuestResponse.buildIdleInProgress(result.endsAt)],
      });
    }

    await interaction.reply({
      embeds: [QuestResponse.buildIdleStarted(result.idle.endsAt)],
    });
  }

  private async _handleIdleClaim(interaction: ChatInputCommandInteraction) {
    const result = await questService.claimIdle(interaction.user.id);

    if (!result.ok) {
      if (result.reason === "unregistered") {
        return await interaction.reply({
          embeds: [QuestResponse.buildUnregistered()],
        });
      }

      if (result.reason === "not_ready") {
        return await interaction.reply({
          embeds: [QuestResponse.buildIdleNotReady(result.endsAt)],
        });
      }

      return await interaction.reply({
        embeds: [QuestResponse.buildIdleNone()],
      });
    }

    await interaction.reply({
      embeds: [QuestResponse.buildIdleClaimResult(result.progression)],
    });
  }
}

export default new QuestCommand();
