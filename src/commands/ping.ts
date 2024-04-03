import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  codeBlock,
} from "discord.js";

import BaseCommand, {
  type BaseCommandInteractOptions,
} from "@base/BaseCommand";

class PingCommand extends BaseCommand {
  data() {
    return new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Get server response and latency");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>,
    opts: BaseCommandInteractOptions
  ) {
    const { client } = opts;

    const latency = {
      API: client?.ws.ping,
      bot: Date.now() - interaction.createdTimestamp,
    };

    await interaction.reply({
      content: codeBlock(
        "API : " + latency.API + "ms\n" + "Latency : " + latency.bot + "ms"
      ),
    });
  }
}

export default new PingCommand();
