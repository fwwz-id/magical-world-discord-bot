import { type HeroRole } from "@prisma/client";

import BaseModel from "@base/BaseModel";
import { models } from "@lib/database";

export default class HeroModel extends BaseModel {
  protected _model = models.hero;

  constructor() {
    super();
  }

  get model() {
    if (!this._model) {
      throw Error();
    }

    return this._model;
  }

  async getAllHeroes() {
    return await this.model.findMany({});
  }

  async getHeroByName(name: string) {
    return await this.model.findUnique({ where: { name } });
  }

  async getHeroByCategory(role: HeroRole) {
    return await this.model.findMany({ where: { role } });
  }

  async create() {}
  async update() {}
  async delete() {}
}
