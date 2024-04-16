import { ChatInputCommandInteraction } from "discord.js";
import UserService from "./UserService";
import type { DiscordIdAndUsername } from "./UserType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class UserResponse<T extends ChatInputCommandInteraction> {
  constructor() {}

  static async getJoinResponse({ discordId, username }: DiscordIdAndUsername) {
    const embed = await UserService.buildJoinResponse({
      discordId,
      username,
    });

    return embed;
  }

  getProfileResponse() {}

  static async getDeleteAccountConfirmationResponse(discordId: string) {
    const { action, embed } =
      await UserService.buildDeleteAccountConfirmationResponse(discordId);

    return { embed, action };
  }

  static getDeleteAccountDeletedResponse() {
    return UserService.buildDeleteAccountDeletedResponse();
  }

  static getDeleteAccountCanceledResponse() {
    return UserService.buildDeleteAccountCanceledResponse();
  }
}
