import { ChatInputCommandInteraction } from "discord.js";
import UserService from "./UserService";
import type { DiscordIdAndUsername } from "./UserType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class UserResponse<T extends ChatInputCommandInteraction> {
  constructor() {}

  static async getJoinResponse({ discordId, username }: DiscordIdAndUsername) {
    const response = await UserService.buildJoinResponse({
      discordId,
      username,
    });

    return response;
  }

  getProfileResponse() {}
}
