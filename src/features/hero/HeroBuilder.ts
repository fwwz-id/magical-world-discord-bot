import type { Element, Hero, HeroRole } from "@prisma/client";

type HeroAttribute = Pick<Hero, "name" | "role" | "element">;

export default class HeroBuilder {
  hero: Partial<HeroAttribute> = {};

  setName(name: HeroAttribute["name"]) {
    this.hero.name = name;

    return this;
  }

  setRole(role: HeroRole) {
    this.hero.role = role;

    return this;
  }

  setElement(element: Element) {
    this.hero.element = element;

    return this;
  }

  toJSON() {
    return this.hero;
  }
}
