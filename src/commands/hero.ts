import BaseCommand from "@base/BaseCommand";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

class HeroCommand extends BaseCommand {
  data() {
    return new SlashCommandBuilder()
      .setName("hero")
      .setDescription("Show all heroes or specific hero")
      .addStringOption((opt) =>
        opt.setName("name").setDescription("Get detail hero by hero name")
      )
      .addNumberOption((opt) =>
        opt.setName("page").setDescription("View specific page")
      ) as SlashCommandBuilder;
  }

  async interact(interaction: ChatInputCommandInteraction<CacheType>) {
    await interaction.reply({
      content: "This is Heroes",
      ephemeral: true,
    });
  }
}

export default new HeroCommand();
