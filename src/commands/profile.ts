import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import BaseCommand from "@base/BaseCommand";
import QuestService from "@features/quest/QuestService";
import UserResponse from "@features/user/UserResponse";

const questService = new QuestService();

class ProfileCommand extends BaseCommand {
  data(): Partial<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("profile")
      .setDescription("Show your adventurer profile");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    await questService.trackMission(interaction.user.id, 1);

    const response = await UserResponse.getProfileResponse(
      interaction.user.id,
      interaction.user.username
    );

    await interaction.reply({ embeds: [response] });
  }
}

export default new ProfileCommand();
