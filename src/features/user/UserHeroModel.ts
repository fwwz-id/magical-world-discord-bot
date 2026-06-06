import BaseModel from "@base/BaseModel";
import { models } from "@lib/database";
import { LogicalException } from "@exception/index";
import { getHeroPower } from "@utils/heroPower";
import { type Hero } from "@prisma/client";

export default class UserHeroModel extends BaseModel {
  protected name = "UserHeroModel";
  protected _model = models.userHeroCollection;

  get model() {
    if (!this._model) {
      throw new LogicalException(
        `${this.name}: Internal model reference is not initialized.`
      );
    }

    return this._model;
  }

  async getByUserId(userId: string) {
    return await this.model.findMany({
      where: { userId },
      include: { Hero: true },
      orderBy: { power: "desc" },
    });
  }

  async assignHero({
    userId,
    hero,
    level = 1,
  }: {
    userId: string;
    hero: Pick<Hero, "id" | "rarity">;
    level?: number;
  }) {
    return await this.model.create({
      data: {
        userId,
        heroId: hero.id,
        level,
        power: getHeroPower(hero.rarity, level),
      },
      include: { Hero: true },
    });
  }

  async countByUserId(userId: string) {
    return await this.model.count({ where: { userId } });
  }

  async create() {}
  async update() {}
  async delete() {}
}
