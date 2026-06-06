import {
  type CacheType,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import BaseCommand from "@base/BaseCommand";
import UserHeroResponse from "@features/user/UserHeroResponse";

class MyHeroesCommand extends BaseCommand {
  data(): Partial<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("my-heroes")
      .setDescription("Show heroes in your roster");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const response = await UserHeroResponse.getMyHeroesResponse(
      interaction.user.id
    );

    await interaction.reply({ embeds: [response] });
  }
}

export default new MyHeroesCommand();
