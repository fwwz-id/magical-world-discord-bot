import "module-alias/register";
import "dotenv/config";

import BotClient from "@lib/bot";
import CommandsHandler from "@lib/commands-handler";

import BaseCommand from "@base/BaseCommand";
import questCommand from "@commands/quest";

const bot = new BotClient();
const commandsHandler = new CommandsHandler();

commandsHandler.registerCommands();

const commands = commandsHandler.commands;

bot.client.once("ready", (client) => {
  console.log(`Welcome back! ${client.user.tag}`);
});

bot.client.on("interactionCreate", async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId.startsWith("quest:daily:claim:")) {
      await questCommand.handleDailyClaimButton(interaction);
    }

    return;
  }

  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (command instanceof BaseCommand) {
    await command.interact(interaction, {
      client: bot.client,
    });
  }
});

bot.login();
