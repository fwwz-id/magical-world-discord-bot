import { HeroRarity } from "@prisma/client";

export const SUMMON_COST = 100;

const RARITY_WEIGHTS: { rarity: HeroRarity; weight: number }[] = [
  { rarity: HeroRarity.Common, weight: 7000 },
  { rarity: HeroRarity.Rare, weight: 2000 },
  { rarity: HeroRarity.Epic, weight: 700 },
  { rarity: HeroRarity.Legendary, weight: 250 },
  { rarity: HeroRarity.Mythical, weight: 50 },
];

const TOTAL_WEIGHT = RARITY_WEIGHTS.reduce((sum, entry) => sum + entry.weight, 0);

export function rollRarity(random = Math.random()): HeroRarity {
  const roll = random * TOTAL_WEIGHT;
  let cumulative = 0;

  for (const entry of RARITY_WEIGHTS) {
    cumulative += entry.weight;
    if (roll < cumulative) return entry.rarity;
  }

  return HeroRarity.Common;
}

export function getRarityRates() {
  return RARITY_WEIGHTS.map(({ rarity, weight }) => ({
    rarity,
    chance: `${((weight / TOTAL_WEIGHT) * 100).toFixed(1)}%`,
  }));
}
