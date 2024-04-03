import { type Hero, HeroRole } from "@prisma/client";
import { AssertException, TypeException } from "@exception/index";
import { type HeroByRole } from "./HeroResponse";
import { type APIEmbedField } from "discord.js";

type HeroAttributes = Pick<Hero, "name" | "element" | "rarity" | "role">;

type EmojisDetail = Record<keyof HeroAttributes, string>;

type EmojisCategory = Record<HeroRole, string>;

type Emojis = {
  detail: EmojisDetail;
  category: EmojisCategory;
};

const emojis: Emojis = {
  detail: {
    name: ":crown: Name",
    role: ":dna: Role",
    element: ":sparkles: Element",
    rarity: ":star: Rarity",
  },
  category: {
    Healer: ":sparkling_heart:   ",
    Damage_Dealer: ":crossed_swords:   ",
    Guardian: ":shield:   ",
    Support: ":revolving_hearts:   ",
  },
};

export default class HeroService {
  private static _name = "HeroService";

  /**
   * generating content hero detail, e.g :
   *
   * - name : Hero Name
   * - role : Role
   *
   * etc
   *
   * @param hero
   * @returns
   */
  static generateContentDetailed(hero: HeroAttributes) {
    return Object.keys(hero).map((key): APIEmbedField => {
      this.assertHeroAttribute(key);

      return {
        name: emojis.detail[key],
        value: hero[key],
      };
    });
  }

  /**
   * concating hero with their element
   * to be single string. e.g :
   * John Doe (water), Foo Bar (fire)
   *
   * @param heroes
   * @returns
   */
  static generateContentFromRole(heroes: Hero[]) {
    return this._concatHeroAndElement(heroes);
  }

  /**
   * generating all heroes by roles, e.g:
   * - Support : hero, hero, hero
   * - Guardian : hero, hero, hero
   *
   * etc.
   *
   * @returns
   */
  static generateContentGrouped(heroes: Hero[]) {
    const heroByRole = this._collectHeroByRole(heroes);
    const content = this._createEmbedContentHeroByRoles(heroByRole);

    return content;
  }

  private static _createEmbedContentHeroByRoles(
    heroByRole: HeroByRole
  ): APIEmbedField[] {
    return Object.keys(heroByRole).map((role) => {
      this.assertIsRole(role);

      const groupedHero = this._concatHeroAndElementByRole(heroByRole, role);
      const emojiRole = this._assignEmojiForHeroRole(role);

      return {
        name: emojiRole,
        value: groupedHero,
      };
    });
  }

  private static _collectHeroByRole(heroes: Hero[]) {
    const heroBasedOnRole: HeroByRole = {
      Healer: [],
      Damage_Dealer: [],
      Guardian: [],
      Support: [],
    };

    heroes.map(({ name, element, role }) => {
      heroBasedOnRole[role].push({ name, element });
    });

    return heroBasedOnRole;
  }

  /**
   * concating hero and element, e.g : John Doe (water), Foo Bar (fire)
   *
   * @param heroes
   * @returns
   */
  private static _concatHeroAndElement(heroes: Hero[]) {
    return heroes.map(({ name, element }) => `${name} (${element})`).join(", ");
  }

  /**
   * concating hero and element by role, e.g :
   *
   * - Healer
   *    -  John Doe (water), Foo Bar (ice), ...so on.
   * - Damage Delaer
   *    - Baz (fire), Doe (inferno), ...so on.
   *
   * @param heroBasedOnRole
   * @param role
   * @returns
   */
  private static _concatHeroAndElementByRole(
    heroBasedOnRole: HeroByRole,
    role: HeroRole
  ) {
    return heroBasedOnRole[role]
      .map(({ name, element }) => `${name} (${element})`)
      .join(", ");
  }

  private static _assignEmojiForHeroRole(role: HeroRole) {
    return emojis.category[role].concat(role.replaceAll("_", " "));
  }

  // Type Guards
  static isHeroRole(role: string): role is HeroRole {
    return Object.keys(HeroRole).some((_role) => _role == role);
  }

  /**
   * check if object is valid
   * hero attribute
   *
   * @param attribute
   */
  static assertHeroAttribute(
    attribute: unknown
  ): asserts attribute is keyof HeroAttributes {
    const validAttributes = ["name", "element", "rarity", "role"];

    if (typeof attribute != "string")
      throw new TypeException(
        `${this._name}: Expected to be string, but got ${typeof attribute}.
        Exception occur in assertHeroAttribute.`
      );

    if (!validAttributes.includes(attribute))
      throw new AssertException(
        `${this._name}: Invalid key or attribute, valid attributes are ${validAttributes}
        Exception occur in assertHeroAttribute.`
      );
  }

  static assertIsRole(role: string): asserts role is HeroRole {
    const roles = Object.keys(HeroRole);
    if (!roles.some((_role) => _role == role)) {
      throw new AssertException(
        `${this._name}: Expected to be a ${roles}, but got : ${role}.
        Exception occur in assertIsRole.`
      );
    }
  }

  static assertHeroIsArray(hero: unknown): asserts hero is Hero[] {
    if (!Array.isArray(hero)) {
      throw new AssertException(
        `${this._name}: Expected to be an Array, but got : ${hero}.
        Exception occur in assertHeroIsArray.`
      );
    }
  }
}
