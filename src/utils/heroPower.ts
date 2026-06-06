import { HeroRarity } from "@prisma/client";

const BASE_POWER: Record<HeroRarity, number> = {
  Common: 100,
  Rare: 500,
  Epic: 1000,
  Legendary: 1500,
  Mythical: 2300,
};

export const SQUAD_LIMIT = 6;

export function getBasePower(rarity: HeroRarity): number {
  return BASE_POWER[rarity];
}

export function getHeroPower(rarity: HeroRarity, level: number): number {
  return getBasePower(rarity) * level;
}
