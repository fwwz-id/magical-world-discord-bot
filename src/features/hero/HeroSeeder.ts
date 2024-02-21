import { HeroElement, HeroRole } from "@prisma/client";

import BaseSeeder from "@base/BaseSeeder";

import HeroModel from "./HeroModel";

type Heroes = { name: string; element: HeroElement; role: HeroRole }[];

// prettier-ignore
const HEROES: Heroes = [
  // Healer
  { name: "Aqua",         element: HeroElement.Water,       role: HeroRole.Healer },
  { name: "Seraphina",    element: HeroElement.Ice,         role: HeroRole.Healer },
  { name: "Winterbloom",  element: HeroElement.Frost,       role: HeroRole.Healer },
  { name: "Ymir",         element: HeroElement.Glacier,     role: HeroRole.Healer },
  { name: "Leviathan",    element: HeroElement.Tsunami,     role: HeroRole.Healer },
  // Damage Dealer
  { name: "Ember",        element: HeroElement.Fire,        role: HeroRole.Damage_Dealer },
  { name: "Cinderheart",  element: HeroElement.Inferno,     role: HeroRole.Damage_Dealer },
  { name: "Voltar",       element: HeroElement.Plasma,      role: HeroRole.Damage_Dealer },
  { name: "Ignis",        element: HeroElement.Phoenix,     role: HeroRole.Damage_Dealer },
  { name: "Sol",          element: HeroElement.Supernova,   role: HeroRole.Damage_Dealer },
  // Guardian
  { name: "Stonewall",    element: HeroElement.Earth,       role: HeroRole.Guardian },
  { name: "Boggart",      element: HeroElement.Mud,         role: HeroRole.Guardian },
  { name: "Dune Strider", element: HeroElement.Sand,        role: HeroRole.Guardian },
  { name: "Atlas",        element: HeroElement.Rock,        role: HeroRole.Guardian },
  { name: "Gaia",         element: HeroElement.Titan,       role: HeroRole.Guardian },
  // Support
  { name: "Zephyr",       element: HeroElement.Wind,        role: HeroRole.Support },
  { name: "Stormcaller",  element: HeroElement.Cyclone,     role: HeroRole.Support },
  { name: "Nimbus",       element: HeroElement.Tempest,     role: HeroRole.Support },
  { name: "Maelstrom",    element: HeroElement.Hurricane,   role: HeroRole.Support },
  { name: "Typhoon",      element: HeroElement.Whirlwind,   role: HeroRole.Support },
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
          },
        });
      })
    );
  }
}
