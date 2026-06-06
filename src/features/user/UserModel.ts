import { type User } from "@prisma/client";
import BaseModel from "@base/BaseModel";

import { LogicalException } from "@exception/index";

import { models } from "@lib/database";

export default class UserModel extends BaseModel {
  protected name: string = "UserModel";
  protected _model = models.user;

  constructor() {
    super();
  }

  get model() {
    if (!this._model) {
      throw new LogicalException(
        `${this.name}: Internal model reference is not initialized.
        Ensure the 'models.users' object is available before accessing it.`
      );
    }

    return this._model;
  }

  async getUserByIdOrDiscordId({
    id,
    discordId,
  }: {
    id?: string;
    discordId: string;
  }) {
    if (id) {
      return await this.model.findUnique({ where: { id } });
    }

    return await this.model.findUnique({ where: { discordId } });
  }

  async getUserWithHeroes(discordId: string) {
    return await this.model.findUnique({
      where: { discordId },
      include: {
        heroOwned: {
          include: { Hero: true },
          orderBy: { power: "desc" },
        },
      },
    });
  }

  async create(user: Pick<User, "discordId">) {
    return await this.model.create({
      data: {
        discordId: user.discordId,
        nextXp: 100,
      },
    });
  }

  update() {}

  async delete({ id, discordId }: { id?: string; discordId: string }) {
    return await this.model.delete({
      where: { id, discordId },
    });
  }
}
