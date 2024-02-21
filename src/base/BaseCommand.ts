import {
  type Client,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

interface BaseCommandImpl {
  data: () => SlashCommandBuilder;
  interact: (
    interaction: ChatInputCommandInteraction,
    client?: Client<boolean>
  ) => Promise<void>;
}

export default abstract class BaseCommand implements BaseCommandImpl {
  abstract data(): SlashCommandBuilder;

  abstract interact(
    interaction: ChatInputCommandInteraction,
    client?: Client<boolean>
  ): Promise<void>;
}
