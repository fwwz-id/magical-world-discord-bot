import { describe, expect, it } from "bun:test";
import { HeroRarity } from "@prisma/client";
import {
  SUMMON_COST,
  getRarityRates,
  rollRarity,
} from "./summonRates";

describe("SUMMON_COST", () => {
  it("is 100 gold", () => {
    expect(SUMMON_COST).toBe(100);
  });
});

describe("getRarityRates", () => {
  it("returns documented percentages", () => {
    const rates = getRarityRates();

    expect(rates).toEqual([
      { rarity: HeroRarity.Common, chance: "70.0%" },
      { rarity: HeroRarity.Rare, chance: "20.0%" },
      { rarity: HeroRarity.Epic, chance: "7.0%" },
      { rarity: HeroRarity.Legendary, chance: "2.5%" },
      { rarity: HeroRarity.Mythical, chance: "0.5%" },
    ]);
  });
});

describe("rollRarity", () => {
  it("returns Common at the low end", () => {
    expect(rollRarity(0)).toBe(HeroRarity.Common);
  });

  it("returns Rare after the Common bucket", () => {
    expect(rollRarity(0.7)).toBe(HeroRarity.Rare);
  });

  it("returns Epic in the Epic bucket", () => {
    expect(rollRarity(0.9)).toBe(HeroRarity.Epic);
  });

  it("returns Legendary in the Legendary bucket", () => {
    expect(rollRarity(0.97)).toBe(HeroRarity.Legendary);
  });

  it("returns Mythical at the top end", () => {
    expect(rollRarity(0.999)).toBe(HeroRarity.Mythical);
  });
});
