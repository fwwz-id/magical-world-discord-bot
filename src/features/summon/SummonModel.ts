import { type Hero, HeroRarity } from "@prisma/client";
import BaseModel from "@base/BaseModel";
import { models } from "@lib/database";
import prisma from "@lib/database";
import { LogicalException } from "@exception/index";
import { getHeroPower } from "@utils/heroPower";
import { SUMMON_COST } from "./summonRates";

export default class SummonModel extends BaseModel {
  protected name = "SummonModel";
  protected _model = models.user;

  get userModel() {
    if (!this._model) {
      throw new LogicalException(`${this.name}: user model not initialized.`);
    }

    return this._model;
  }

  get heroModel() {
    return models.hero;
  }

  async getUserByDiscordId(discordId: string) {
    return await this.userModel.findUnique({ where: { discordId } });
  }

  async getHeroesByRarity(rarity: HeroRarity) {
    return await this.heroModel.findMany({ where: { rarity } });
  }

  async getSquadCount(userId: string) {
    return await models.userHeroCollection.count({ where: { userId } });
  }

  async executeSummon(userId: string, hero: Hero) {
    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });

      if (user.gold < SUMMON_COST) {
        return { ok: false as const, reason: "insufficient_gold" as const };
      }

      await tx.user.update({
        where: { id: userId },
        data: { gold: user.gold - SUMMON_COST },
      });

      const collection = await tx.userHeroCollection.create({
        data: {
          userId,
          heroId: hero.id,
          level: 1,
          power: getHeroPower(hero.rarity, 1),
        },
        include: { Hero: true },
      });

      return {
        ok: true as const,
        hero: collection.Hero,
        goldRemaining: user.gold - SUMMON_COST,
      };
    });
  }

  async create() {}
  async update() {}
  async delete() {}
}
