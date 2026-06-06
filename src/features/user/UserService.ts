import { HeroRarity } from "@prisma/client";

import UserModel from "./UserModel";
import UserHeroModel from "./UserHeroModel";
import HeroModel from "@features/hero/HeroModel";

import type { DiscordIdAndUsername } from "./UserType";
import { SQUAD_LIMIT } from "@utils/heroPower";

export type JoinResult =
  | { status: "already_joined" }
  | { status: "welcome"; username: string; starterHeroName: string | null };

export type ProfileData = {
  username: string;
  level: number;
  xp: number;
  nextXp: number;
  gold: number;
  squadCount: number;
  totalPower: number;
};

export default class UserService {
  static async join({
    discordId,
    username,
  }: DiscordIdAndUsername): Promise<JoinResult> {
    const userModel = new UserModel();
    const isJoined = await userModel.getUserByIdOrDiscordId({ discordId });

    if (isJoined) {
      return { status: "already_joined" };
    }

    const user = await userModel.create({ discordId });
    const starterHeroName = await this._grantStarterHero(user.id);

    return { status: "welcome", username, starterHeroName };
  }

  static async getProfile(
    discordId: string,
    username: string
  ): Promise<ProfileData | null> {
    const user = await new UserModel().getUserWithHeroes(discordId);

    if (!user) return null;

    const totalPower = user.heroOwned.reduce((sum, { power }) => sum + power, 0);

    return {
      username,
      level: user.level,
      xp: user.xp,
      nextXp: user.nextXp,
      gold: user.gold,
      squadCount: user.heroOwned.length,
      totalPower,
    };
  }

  static async isRegistered(discordId: string) {
    const user = await new UserModel().getUserByIdOrDiscordId({ discordId });
    return Boolean(user);
  }

  static async deleteUser(discordId: string) {
    return await new UserModel().delete({ discordId });
  }

  private static async _grantStarterHero(userId: string) {
    const heroModel = new HeroModel();
    const commonHeroes = await heroModel.model.findMany({
      where: { rarity: HeroRarity.Common },
    });

    if (!commonHeroes.length) return null;

    const starter =
      commonHeroes[Math.floor(Math.random() * commonHeroes.length)];

    await new UserHeroModel().assignHero({ userId, hero: starter });

    return starter.name;
  }
}

export { SQUAD_LIMIT };
