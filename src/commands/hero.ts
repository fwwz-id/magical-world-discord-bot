import { HeroRole } from "@prisma/client";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import BaseCommand from "@base/BaseCommand";
import HeroResponseBuilder from "@features/hero/HeroResponseBuilder";

class HeroCommand extends BaseCommand {
  data() {
    return new SlashCommandBuilder()
      .setName("hero")
      .setDescription("Show all heroes or specific hero")
      .addStringOption((opt) =>
        opt.setName("name").setDescription("Get detail hero by hero name")
      )
      .addStringOption((command) => {
        const options = command
          .setName("category")
          .setDescription("Get heroes by category");

        Object.values(HeroRole).forEach((role) =>
          options.addChoices({ name: role, value: role })
        );

        return options;
      }) as SlashCommandBuilder;
  }

  async interact(interaction: ChatInputCommandInteraction<CacheType>) {
    const response = new HeroResponseBuilder(interaction);
    const heroes = await response.getHeroesResponse();

    await interaction.reply({
      embeds: [heroes],
      ephemeral: true,
    });
  }
}

export default new HeroCommand();
