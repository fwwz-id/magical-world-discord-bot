import { EmbedBuilder } from "discord.js";
import colors from "@utils/colors";

export default class CommonResponse {
  static buildErrorResponse() {
    const embed = new EmbedBuilder();

    return embed
      .setTitle("Error")
      .setColor(colors.red)
      .setDescription("Unknown error, please contact developer.");
  }
}
