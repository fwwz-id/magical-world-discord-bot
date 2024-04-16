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

  static buildUnregisteredResponse() {
    const embed = new EmbedBuilder();

    return embed.setTitle("Whoops :)").setColor(colors.red)
      .setDescription(`Looks like you haven't registered yet.
      To join the adventure and use game commands, type **/join**
      to begin your journey.`);
  }
}
