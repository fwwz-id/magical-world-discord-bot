import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import BaseCommand from "@base/BaseCommand";
import SummonService from "@features/summon/SummonService";
import SummonResponse from "@features/summon/SummonResponse";

const summonService = new SummonService();

class SummonCommand extends BaseCommand {
  data() {
    return new SlashCommandBuilder()
      .setName("summon")
      .setDescription("Summon a hero using gold")
      .addSubcommand((sub) =>
        sub
          .setName("pull")
          .setDescription(`Summon a random hero for ${summonService.getCost()} gold`)
      )
      .addSubcommand((sub) =>
        sub.setName("rates").setDescription("View summon rarity rates and cost")
      );
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "rates") {
      await interaction.reply({
        embeds: [
          SummonResponse.buildRatesEmbed(
            summonService.getRates(),
            summonService.getCost()
          ),
        ],
      });
      return;
    }

    const result = await summonService.summon(interaction.user.id);

    await interaction.reply({
      embeds: [SummonResponse.buildSummonResult(result)],
    });
  }
}

export default new SummonCommand();
