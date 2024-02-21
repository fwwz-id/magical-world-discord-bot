import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import BaseCommand from "@base/BaseCommand";

class PingCommand extends BaseCommand {
  data() {
    return new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Get server response and latency");
  }

  async interact(interaction: ChatInputCommandInteraction<CacheType>) {
    const latency = {
      bot: Date.now() - interaction.createdTimestamp,
    };

    await interaction.reply({
      content: `Latency : ${latency.bot}ms`,
    });
  }
}

export default new PingCommand();
