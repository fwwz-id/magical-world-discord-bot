import { HeroElement, HeroRarity, HeroRole } from "@prisma/client";

import BaseSeeder from "@base/BaseSeeder";

import HeroModel from "./HeroModel";

type Heroes = {
  name: string;
  element: HeroElement;
  role: HeroRole;
  rarity: HeroRarity;
}[];

// prettier-ignore
const HEROES: Heroes = [
  // Healer
  { name: "Aqua",         element: HeroElement.Water,       role: HeroRole.Healer,          rarity: HeroRarity.Common },
  { name: "Seraphina",    element: HeroElement.Ice,         role: HeroRole.Healer,          rarity: HeroRarity.Rare },
  { name: "Winterbloom",  element: HeroElement.Frost,       role: HeroRole.Healer,          rarity: HeroRarity.Epic },
  { name: "Ymir",         element: HeroElement.Glacier,     role: HeroRole.Healer,          rarity: HeroRarity.Legendary },
  { name: "Leviathan",    element: HeroElement.Tsunami,     role: HeroRole.Healer,          rarity: HeroRarity.Mythical },
  // Damage Dealer
  { name: "Ember",        element: HeroElement.Fire,        role: HeroRole.Damage_Dealer,   rarity: HeroRarity.Common },
  { name: "Cinderheart",  element: HeroElement.Inferno,     role: HeroRole.Damage_Dealer,   rarity: HeroRarity.Rare },
  { name: "Voltar",       element: HeroElement.Plasma,      role: HeroRole.Damage_Dealer,   rarity: HeroRarity.Epic },
  { name: "Ignis",        element: HeroElement.Phoenix,     role: HeroRole.Damage_Dealer,   rarity: HeroRarity.Legendary },
  { name: "Sol",          element: HeroElement.Supernova,   role: HeroRole.Damage_Dealer,   rarity: HeroRarity.Mythical },
  // Guardian
  { name: "Stonewall",    element: HeroElement.Earth,       role: HeroRole.Guardian,        rarity: HeroRarity.Common },
  { name: "Boggart",      element: HeroElement.Mud,         role: HeroRole.Guardian,        rarity: HeroRarity.Rare },
  { name: "Dune Strider", element: HeroElement.Sand,        role: HeroRole.Guardian,        rarity: HeroRarity.Epic },
  { name: "Atlas",        element: HeroElement.Rock,        role: HeroRole.Guardian,        rarity: HeroRarity.Legendary },
  { name: "Gaia",         element: HeroElement.Titan,       role: HeroRole.Guardian,        rarity: HeroRarity.Mythical },
  // Support
  { name: "Zephyr",       element: HeroElement.Wind,        role: HeroRole.Support,         rarity: HeroRarity.Common },
  { name: "Stormcaller",  element: HeroElement.Cyclone,     role: HeroRole.Support,         rarity: HeroRarity.Rare },
  { name: "Nimbus",       element: HeroElement.Tempest,     role: HeroRole.Support,         rarity: HeroRarity.Epic },
  { name: "Maelstrom",    element: HeroElement.Hurricane,   role: HeroRole.Support,         rarity: HeroRarity.Legendary },
  { name: "Typhoon",      element: HeroElement.Whirlwind,   role: HeroRole.Support,         rarity: HeroRarity.Mythical },
];

export default class HeroSeeder extends BaseSeeder {
  async seed() {
    return Promise.all(
      HEROES.map(async (hero) => {
        return new HeroModel().model.create({
          data: {
            name: hero.name,
            role: hero.role,
            element: hero.element,
            rarity: hero.rarity,
          },
        });
      })
    );
  }
}
