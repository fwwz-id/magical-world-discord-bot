import SummonModel from "./SummonModel";
import { rollRarity, SUMMON_COST, getRarityRates } from "./summonRates";
import { SQUAD_LIMIT } from "@utils/heroPower";
import type { Hero } from "@prisma/client";

export type SummonResult =
  | { ok: false; reason: "unregistered" }
  | { ok: false; reason: "squad_full" }
  | { ok: false; reason: "insufficient_gold"; gold: number }
  | { ok: false; reason: "no_heroes" }
  | { ok: true; hero: Hero; goldRemaining: number };

export default class SummonService {
  private model: SummonModel;

  constructor(model = new SummonModel()) {
    this.model = model;
  }

  async summon(discordId: string): Promise<SummonResult> {
    const user = await this.model.getUserByDiscordId(discordId);

    if (!user) return { ok: false, reason: "unregistered" };

    const squadCount = await this.model.getSquadCount(user.id);

    if (squadCount >= SQUAD_LIMIT) {
      return { ok: false, reason: "squad_full" };
    }

    if (user.gold < SUMMON_COST) {
      return { ok: false, reason: "insufficient_gold", gold: user.gold };
    }

    const rarity = rollRarity();
    const pool = await this.model.getHeroesByRarity(rarity);

    if (!pool.length) return { ok: false, reason: "no_heroes" };

    const hero = pool[Math.floor(Math.random() * pool.length)];
    const result = await this.model.executeSummon(user.id, hero);

    if (!result.ok) {
      return {
        ok: false,
        reason: "insufficient_gold",
        gold: user.gold,
      };
    }

    return {
      ok: true,
      hero: result.hero,
      goldRemaining: result.goldRemaining,
    };
  }

  getRates() {
    return getRarityRates();
  }

  getCost() {
    return SUMMON_COST;
  }
}
