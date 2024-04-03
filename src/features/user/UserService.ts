import { EmbedBuilder } from "discord.js";
import { type User } from "@prisma/client";

import UserModel from "./UserModel";

import type { DiscordIdAndUsername } from "./UserType";

export default class UserService {
  private static _name = "UserService";

  static async buildJoinResponse({
    discordId,
    username,
  }: DiscordIdAndUsername) {
    const userModel = new UserModel();
    const embed = new EmbedBuilder();

    let isJoined: User | null = null;

    try {
      isJoined = await userModel.getUserByIdAndDiscordId({ discordId });

      if (!isJoined)
        await userModel.create({
          discordId,
        });
    } catch (err) {
      throw err;
    }

    if (isJoined) {
      return embed.setTitle("Hi")
        .setDescription(`You've already been registered, Do you want to reset your journey?
        If so, please use **/reset** to start a new journey.`);
    }

    return embed.setTitle("Welcome!")
      .setDescription(`A portal shimmers open, and a new adventurer steps forth!
      Welcome,  **[${username}]**, to the realms of magic!.
      
      Here some commands may help you :
        - **/quest** - your quest info
        - **/profile** - your profile info (level, xp, etc)
        - **/inventory** - your equipment info
        - **/heroes** - your heroes info

      You can start your journey by **/help** commands to see all the available commands,
      `);
  }

  static async buildProfileResponse(discordId: string) {
    const userModel = new UserModel();
    const embed = new EmbedBuilder();

    try {
      const user = await userModel.getUserByIdAndDiscordId({ discordId });

      if (!user) {
        embed.setTitle("Sorry :)").setDescription("You're not ye");
      }
    } catch (err) {
      throw err;
    }
  }
}
