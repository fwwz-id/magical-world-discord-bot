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

  async create() {}
  async update() {}
  async delete() {}
}
