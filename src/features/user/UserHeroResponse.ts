import { EmbedBuilder } from "discord.js";
import colors from "@utils/colors";
import { SQUAD_LIMIT } from "@utils/heroPower";
import CommonResponse from "@features/common/CommonResponse";
import UserModel from "./UserModel";

export default class UserHeroResponse {
  static async getMyHeroesResponse(discordId: string) {
    const user = await new UserModel().getUserWithHeroes(discordId);

    if (!user) {
      return CommonResponse.buildUnregisteredResponse();
    }

    const embed = new EmbedBuilder()
      .setTitle("Your Heroes")
      .setColor(colors.sky)
      .setDescription(
        `Squad: **${user.heroOwned.length}/${SQUAD_LIMIT}** heroes`
      );

    if (!user.heroOwned.length) {
      embed.addFields({
        name: "No heroes yet",
        value: "Your roster is empty. More heroes can be earned through quests and summoning (coming soon).",
      });

      return embed;
    }

    user.heroOwned.forEach(({ Hero, level, power }) => {
      const role = Hero.role.replaceAll("_", " ");

      embed.addFields({
        name: `${Hero.name} — Lv. ${level}`,
        value: `${role} · ${Hero.element} · ${Hero.rarity}\nPower: **${power}**`,
      });
    });

    return embed;
  }
}
