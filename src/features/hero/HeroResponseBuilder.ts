import { type Hero, HeroRole, HeroElement } from "@prisma/client";
import {
  EmbedBuilder,
  type ChatInputCommandInteraction,
  type EmbedData,
} from "discord.js";

import HeroModel from "./HeroModel";

import { AssertException } from "@exception/index";

type HeroBasedOnRole = {
  [Role in HeroRole]: { name: string; element: HeroElement }[];
};

export default class HeroResponseBuilder<
  T extends ChatInputCommandInteraction,
> {
  private _options: T["options"];
  private _hero: Hero | Hero[] | null = null;

  constructor(interact: T) {
    this._options = interact.options;
  }

  get options() {
    return this._options;
  }

  get hero() {
    return this._hero;
  }

  async getHeroesResponse() {
    const isByCategory = this._getAllOptionsValue().category;

    await this._fetchHeroes();

    let embedData: EmbedData = {
      color: 0x0099ff,
      title: isByCategory ? "Hero by Category" : "Heroes",
    };

    embedData = {
      ...embedData,
      ...this._buildEmbedResponseAllHeroes(),
    };

    if (isByCategory) {
      embedData = {
        ...embedData,
        ...this._buildEmbedResponseHeroByCategory(),
      };
    }

    return new EmbedBuilder(embedData);
  }

  private _buildEmbedResponseAllHeroes() {
    const data: EmbedData = {};

    this._assertHeroIsArray(this.hero);

    const heroBasedOnRole: HeroBasedOnRole = {
      Healer: [],
      Damage_Dealer: [],
      Guardian: [],
      Support: [],
    };

    this.hero.map(
      ({ name, role, element }) =>
        (heroBasedOnRole[role] = [...heroBasedOnRole[role], { name, element }])
    );

    data.fields = Object.keys(heroBasedOnRole).map((role) => {
      const _role = role as keyof HeroBasedOnRole;
      const value = heroBasedOnRole[_role]
        .map(({ name, element }) => `${name} (${element})`)
        .join(", ");

      return {
        name: _role.replaceAll("_", " "),
        value,
      };
    });

    return data;
  }

  private _buildEmbedResponseHeroByCategory() {
    const data: EmbedData = {};

    if (!Array.isArray(this.hero)) {
      data.fields = [
        { name: "Not found", value: "There's no hero in this category" },
      ];

      return data;
    }

    const heroes = this.hero
      .map(({ name, element }) => `${name} (${element})`)
      .join(", ");

    data.fields = [
      {
        name: "Name",
        value: heroes,
      },
    ];

    return data;
  }

  private _getAllOptionsValue() {
    const name = this.options.getString("name");
    const category = this.options.getString("category");

    return { name, category };
  }

  private async _fetchHeroes() {
    const { name, category } = {
      ...this._getAllOptionsValue(),
    };

    const heroModel = new HeroModel();

    this._hero = name
      ? await heroModel.getHeroByName(name)
      : category && this._isHeroRole(category)
        ? await heroModel.getHeroByCategory(category)
        : await heroModel.getAllHeroes();

    return this;
  }

  private _isHeroRole(role: string): role is HeroRole {
    return Object.keys(HeroRole).some((_role) => _role == role);
  }

  private _assertHeroIsArray(hero: unknown): asserts hero is Hero[] {
    if (!Array.isArray(hero)) {
      throw new AssertException(
        `Expedted to be an Array, but got : ${typeof hero} `
      );
    }
  }
}
