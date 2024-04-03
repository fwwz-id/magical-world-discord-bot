import {
  type Client,
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export type BaseCommandInteractOptions = Partial<{
  client: Client<boolean>;
}>;

interface BaseCommandImpl {
  data: () => Partial<SlashCommandBuilder>;
  interact: (
    interaction: ChatInputCommandInteraction,
    opts: BaseCommandInteractOptions
  ) => Promise<void>;
}

export default abstract class BaseCommand implements BaseCommandImpl {
  cooldown = 3;

  abstract data(): Partial<SlashCommandBuilder>;

  abstract interact(
    interaction: ChatInputCommandInteraction,
    opts: BaseCommandInteractOptions
  ): Promise<void>;
}
