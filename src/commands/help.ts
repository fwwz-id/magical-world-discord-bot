import {
  type CacheType,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import BaseCommand from "@base/BaseCommand";
import colors from "@utils/colors";
import { default as ping } from "./ping";
import { default as hero } from "./hero";
import { default as profile } from "./profile";
import { default as join } from "./join";
import { default as deleteAccount } from "./delete-account";
import { default as myHeroes } from "./my-heroes";
import { default as quest } from "./quest";
import { default as summon } from "./summon";

const gameCommands = [
  ping,
  hero,
  profile,
  join,
  deleteAccount,
  myHeroes,
  quest,
  summon,
];

const QUEST_SUBCOMMANDS = [
  "**/quest daily** — View daily missions and claim rewards",
  "**/quest idle start** — Start a one-hour idle expedition",
  "**/quest idle claim** — Claim idle expedition rewards",
  "**/quest story** — Preview story mode and roadmap",
];

const SUMMON_SUBCOMMANDS = [
  "**/summon pull** — Summon a random hero for 100 gold",
  "**/summon rates** — View summon rarity rates and cost",
];

class HelpCommand extends BaseCommand {
  data(): Partial<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("help")
      .setDescription("List all available commands");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const lines = gameCommands
      .filter((command) => command !== quest && command !== summon)
      .map((command) => {
        const data = command.data();
        return `**/${data.name}** — ${data.description}`;
      })
      .concat(QUEST_SUBCOMMANDS, SUMMON_SUBCOMMANDS)
      .sort();

    const embed = new EmbedBuilder()
      .setTitle("Magical World — Commands")
      .setColor(colors.sky)
      .setDescription(lines.join("\n"));

    await interaction.reply({ embeds: [embed] });
  }
}

export default new HelpCommand();
