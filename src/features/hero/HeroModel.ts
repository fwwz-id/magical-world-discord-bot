import { type HeroRole } from "@prisma/client";

import BaseModel from "@base/BaseModel";
import { models } from "@lib/database";

import { LogicalException } from "@exception/index";

export default class HeroModel extends BaseModel {
  protected name = "HeroModel";
  protected _model = models.hero;

  constructor() {
    super();
  }

  get model() {
    if (!this._model) {
      throw new LogicalException(
        `${this.name}: Internal model reference is not initialized.
        Ensure the 'models.hero' object is available before accessing it.`
      );
    }

    return this._model;
  }

  async getAllHeroes() {
    return await this.model.findMany({
      orderBy: {
        element: "asc",
      },
    });
  }

  async getHeroByName(name: string) {
    return await this.model.findUnique({ where: { name } });
  }

  async getHeroByCategory(role: HeroRole) {
    return await this.model.findMany({
      where: { role },
      orderBy: {
        element: "asc",
      },
    });
  }

  async create() {}
  async update() {}
  async delete() {}
}
