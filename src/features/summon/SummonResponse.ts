import { EmbedBuilder } from "discord.js";
import colors from "@utils/colors";
import CommonResponse from "@features/common/CommonResponse";
import { SUMMON_COST } from "./summonRates";
import type { SummonResult } from "./SummonService";
import type { Hero } from "@prisma/client";
import { SQUAD_LIMIT } from "@utils/heroPower";

const RARITY_COLORS: Record<string, number> = {
  Common: 0x9e9e9e,
  Rare: 0x2196f3,
  Epic: 0x9c27b0,
  Legendary: 0xff9800,
  Mythical: 0xff1744,
};

export default class SummonResponse {
  static buildSummonResult(result: SummonResult) {
    if (!result.ok) {
      return this.buildError(result);
    }

    return this.buildSuccess(result.hero, result.goldRemaining);
  }

  static buildSuccess(hero: Hero, goldRemaining: number) {
    const role = hero.role.replaceAll("_", " ");
    const color = RARITY_COLORS[hero.rarity] ?? colors.sky;

    return new EmbedBuilder()
      .setTitle("✨ Summon Complete!")
      .setColor(color)
      .setDescription(
        [
          `**${hero.name}** joins your squad!`,
          `${role} · ${hero.element} · **${hero.rarity}**`,
          "",
          `Gold remaining: **${goldRemaining}**`,
        ].join("\n")
      );
  }

  static buildError(result: Extract<SummonResult, { ok: false }>) {
    if (result.reason === "unregistered") {
      return CommonResponse.buildUnregisteredResponse();
    }

    if (result.reason === "insufficient_gold") {
      return CommonResponse.buildErrorResponse().setDescription(
        `Not enough gold. Summon costs **${SUMMON_COST}** gold — you have **${result.gold}**.`
      );
    }

    if (result.reason === "squad_full") {
      return CommonResponse.buildErrorResponse().setDescription(
        `Your squad is full (${SQUAD_LIMIT}/${SQUAD_LIMIT}). Make room before summoning.`
      );
    }

    return CommonResponse.buildErrorResponse().setDescription(
      "No heroes available for this rarity. Contact a developer."
    );
  }

  static buildRatesEmbed(
    rates: { rarity: string; chance: string }[],
    cost: number
  ) {
    const embed = new EmbedBuilder()
      .setTitle("Summon Rates")
      .setColor(colors.sky)
      .setDescription(`Each summon costs **${cost} gold**.`)
      .addFields(
        rates.map(({ rarity, chance }) => ({
          name: rarity,
          value: chance,
          inline: true,
        }))
      );

    return embed;
  }
}
