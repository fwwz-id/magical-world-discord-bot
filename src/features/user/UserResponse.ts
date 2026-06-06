import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import UserService, { SQUAD_LIMIT, type ProfileData } from "./UserService";
import type { DiscordIdAndUsername } from "./UserType";
import CommonResponse from "@features/common/CommonResponse";
import colors from "@utils/colors";

export default class UserResponse {
  static async getJoinResponse({ discordId, username }: DiscordIdAndUsername) {
    const result = await UserService.join({ discordId, username });
    return this.buildJoinEmbed(result);
  }

  static buildJoinEmbed(
    result: Awaited<ReturnType<typeof UserService.join>>
  ) {
    const embed = new EmbedBuilder().setColor(colors.sky);

    if (result.status === "already_joined") {
      return embed
        .setTitle("Hi")
        .setDescription(
          `You've already been registered. Do you want to delete your progress?
        If so, please use **/delete-account** to delete your current progress.`
        );
    }

    const starterLine = result.starterHeroName
      ? `\n\nA shimmering portal reveals **${result.starterHeroName}**, your first companion!`
      : "";

    return embed
      .setTitle("Welcome!")
      .setDescription(
        `A portal shimmers open, and a new adventurer steps forth!
      Welcome, **[${result.username}]**, to the realms of magic!${starterLine}
      
      Here are some commands to get started:
        ${[
          "- **/profile** - your profile info (level, xp, etc)",
          "- **/my-heroes** - your hero roster",
          "- **/hero** - browse the hero catalogue",
          "- **/quest daily** - daily missions",
        ].join("\n")}

      Use **/help** to see all available commands.`
      );
  }

  static async getProfileResponse(discordId: string, username: string) {
    const profile = await UserService.getProfile(discordId, username);

    if (!profile) {
      return CommonResponse.buildUnregisteredResponse();
    }

    return this.buildProfileEmbed(profile);
  }

  static buildProfileEmbed(profile: ProfileData) {
    const xpBar = this._buildXpBar(profile.xp, profile.nextXp);

    return new EmbedBuilder()
      .setTitle(`${profile.username}'s Profile`)
      .setColor(colors.sky)
      .addFields(
        { name: "Level", value: `${profile.level}`, inline: true },
        {
          name: "Experience",
          value: `${profile.xp} / ${profile.nextXp}\n${xpBar}`,
          inline: true,
        },
        { name: "Gold", value: `${profile.gold}`, inline: true },
        {
          name: "Squad",
          value: `${profile.squadCount}/${SQUAD_LIMIT} heroes`,
          inline: true,
        },
        { name: "Total Power", value: `${profile.totalPower}`, inline: true }
      );
  }

  static async getDeleteAccountConfirmationResponse(discordId: string) {
    const registered = await UserService.isRegistered(discordId);

    if (!registered) {
      return {
        embed: CommonResponse.buildUnregisteredResponse(),
        action: null,
      };
    }

    return {
      embed: new EmbedBuilder()
        .setTitle("Are you sure?")
        .setColor(colors.red)
        .setDescription(
          `**Warning**: Clicking **"confirm"** will permanently delete your account.
          If you don't select within 1 minute, your account will be automatically deleted.`
        ),
      action: this.buildDeleteAccountAction(),
    };
  }

  static getDeleteAccountDeletedResponse() {
    return new EmbedBuilder()
      .setTitle("Good bye :(")
      .setDescription(
        `We appreciate your time playing!
      To help us improve, would you mind sharing some feedback here:
      link to feedback form: https://www.feedback.com`
      )
      .setColor(colors.sky);
  }

  static getDeleteAccountCanceledResponse() {
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

    return new ActionRowBuilder<ButtonBuilder>().addComponents(confirm, cancel);
  }

  private static _buildXpBar(current: number, max: number, length = 10) {
    const ratio = Math.min(current / max, 1);
    const filled = Math.round(ratio * length);

    return `${"█".repeat(filled)}${"░".repeat(length - filled)}`;
  }
}
