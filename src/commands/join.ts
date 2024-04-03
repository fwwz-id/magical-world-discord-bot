import BaseCommand from "@base/BaseCommand";
import UserResponse from "@features/user/UserResponse";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

class JoinCommand extends BaseCommand {
  data(): Partial<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("join")
      .setDescription("start a new adventure");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const user = interaction.user;
    const response = await UserResponse.getJoinResponse({
      discordId: user.id,
      username: user.username,
    });

    await interaction.reply({
      embeds: [response],
    });
  }
}

export default new JoinCommand();
