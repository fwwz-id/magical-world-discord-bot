import BaseModel from "@base/BaseModel";

import { models } from "@lib/database";

export default class UserModel extends BaseModel {
  protected _model = models.user;

  constructor() {
    super();
  }

  create() {}

  update() {}

  delete() {}
}
