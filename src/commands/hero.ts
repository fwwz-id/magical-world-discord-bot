import { HeroRole } from "@prisma/client";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import BaseCommand from "@base/BaseCommand";
import HeroResponse from "@features/hero/HeroResponse";

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
      });
  }

  async interact(interaction: ChatInputCommandInteraction<CacheType>) {
    const response = new HeroResponse(interaction);
    const heroes = await response.getResponse();

    await interaction.reply({
      embeds: [heroes],
    });
  }
}

export default new HeroCommand();
