import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { type User } from "@prisma/client";

import UserModel from "./UserModel";

import type { DiscordIdAndUsername } from "./UserType";
import CommonResponse from "@features/common/CommonResponse";
import colors from "@utils/colors";

export default class UserService {
  private static _name = "UserService";

  static async buildJoinResponse({
    discordId,
    username,
  }: DiscordIdAndUsername) {
    const userModel = new UserModel();
    const embed = new EmbedBuilder().setColor(colors.sky);

    let isJoined: User | null = null;

    try {
      isJoined = await userModel.getUserByIdOrDiscordId({ discordId });

      if (!isJoined)
        await userModel.create({
          discordId,
        });
    } catch (err) {
      throw err;
    }

    if (isJoined) {
      return embed.setTitle("Hi")
        .setDescription(`You've already been registered, Do you want to delete your progress?
        If so, please use **/delete-account** to delete your current progress.`);
    }

    return embed.setTitle("Welcome!")
      .setDescription(`A portal shimmers open, and a new adventurer steps forth!
      Welcome,  **[${username}]**, to the realms of magic!.
      
      Here some commands may help you :
        ${[
          "- **/quest** - your quest info",
          "- **/profile** - your profile info (level, xp, etc)",
          "- **/inventory** - your equipment info",
          "- **/heroes** - your heroes info",
        ].join("\n")}

      You can start your journey by **/help** commands to see all the available commands,
      `);
  }

  static async buildDeleteAccountConfirmationResponse(discordId: string) {
    const userModel = new UserModel();
    let embed = new EmbedBuilder(),
      action: ActionRowBuilder<ButtonBuilder> | null =
        this.buildDeleteAccountAction();

    try {
      const user = await userModel.getUserByIdOrDiscordId({ discordId });

      if (!user) {
        embed = CommonResponse.buildUnregisteredResponse();
        action = null;

        return { embed, action };
      }

      embed
        .setTitle("Are you sure?")
        .setColor(colors.red)
        .setDescription(
          `**Warning**: Clicking **"confirm"** will permanently delete your account.
          If you don't select within 1 minute, your account will be automatically deleted.`
        );

      return { embed, action };
    } catch (err) {
      throw err;
    }
  }

  static buildDeleteAccountDeletedResponse() {
    return new EmbedBuilder()
      .setTitle("Good bye :(")
      .setDescription(
        `We appreciate your time playing!
      To help us improve, would you mind sharing some feedback here:
      link to feedback form: https://www.feedback.com`
      )
      .setColor(colors.sky);
  }

  static buildDeleteAccountCanceledResponse() {
    return new EmbedBuilder()
      .setTitle(":)")
      .setDescription(
        `Thanks for keeping your account! Any feedback?
      https://feedback.com`
      )
      .setColor(colors.sky);
  }

  static buildDeleteAccountAction() {
    const confirm = new ButtonBuilder()
      .setCustomId("confirm")
      .setLabel("Yes, delete my account.")
      .setStyle(ButtonStyle.Primary);

    const cancel = new ButtonBuilder()
      .setCustomId("cancel")
      .setLabel("No, I don't")
      .setStyle(ButtonStyle.Danger);

    const actions = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirm,
      cancel
    );

    return actions;
  }
}
