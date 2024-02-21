import { Element, HeroRole } from "@prisma/client";

import BaseSeeder from "@base/BaseSeeder";

import HeroModel from "./HeroModel";

type HeroNameBasedOnElement = { [key in Element]: [string, HeroRole] };

export default class HeroSeeder extends BaseSeeder {
  _HEROES: HeroNameBasedOnElement = {
    WATER: ["Aqua", HeroRole.HEALER],
    FIRE: ["Ember", HeroRole.DAMAGE_DEALER],
    WIND: ["Zephyr", HeroRole.SUPPORT],
    EARTH: ["Stonewall", HeroRole.GUARDIAN],

    ICE: ["Seraphina", HeroRole.HEALER],
    INFERNO: ["Cinderheart", HeroRole.DAMAGE_DEALER],
    CYCLONE: ["Stormcaller", HeroRole.SUPPORT],
    MUD: ["Boggart", HeroRole.GUARDIAN],

    FROST: ["Winterbloom", HeroRole.HEALER],
    PLASMA: ["Voltar", HeroRole.DAMAGE_DEALER],
    TEMPEST: ["Nimbus", HeroRole.SUPPORT],
    SAND: ["Dune Strider", HeroRole.GUARDIAN],

    GLACIER: ["Ymir", HeroRole.HEALER],
    PHOENIX: ["Ignis", HeroRole.DAMAGE_DEALER],
    HURRICANE: ["Maelstrom", HeroRole.SUPPORT],
    ROCK: ["Atlas", HeroRole.GUARDIAN],

    TSUNAMI: ["Leviathan", HeroRole.HEALER],
    SUPERNOVA: ["Sol", HeroRole.DAMAGE_DEALER],
    WHIRLWIND: ["Typhoon", HeroRole.SUPPORT],
    TITAN: ["Gaia", HeroRole.GUARDIAN],
  };

  async seed() {
    const elements = Object.keys(this._HEROES) as Element[];

    return Promise.all(
      elements.map(async (element) => {
        return new HeroModel().model.create({
          data: {
            name: this._HEROES[element][0],
            role: this._HEROES[element][1],
            element,
          },
        });
      })
    );
  }
}
