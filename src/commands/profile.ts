import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import BaseCommand from "@base/BaseCommand";

class ProfileCommand extends BaseCommand {
  data(): Partial<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("profile")
      .setDescription("show user profile");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    await interaction.reply({
      content: "Hello profile!",
    });
  }
}

export default new ProfileCommand();
