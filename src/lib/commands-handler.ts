import path from "path";
import { Collection, Routes } from "discord.js";

import type BaseCommand from "@base/BaseCommand";
import commands, { type ExportCommandsKey } from "@commands/index";
import { AssertException, LogicalException, TypeException } from "@exception/index";

import { DC_APP_ID, DC_GUILD_ID } from "@config/base";
import { rest } from "@config/discord";

import getFilenamesFromDir from "@utils/getFilenamesFromDir";
import { isProd } from "@utils/is";

type ApplicationCommandOptions = {
  /** this should be an enum, don't know yet what values are */
  type: number;
  name: string;
  name_localizations: unknown;
  description: string;
  description_localizations: unknown;
};

type RESTApplicationCommandsResponse = {
  id: string;
  application_id: string;
  version: string;
  default_member_permissions: unknown;
  /** this should be an enum, don't know yet what values are */
  type: number;
  name: string;
  name_localizations: unknown;
  description: string;
  description_localizations: unknown;
  guild_id: string;
  options?: ApplicationCommandOptions[];
  nsfw: boolean;
};

export default class CommandsHandler {
  commands = new Collection<string, BaseCommand>();

  private _commandDir = path.join(process.cwd(), "/src/commands");

  collectCommands() {
    const filenames = getFilenamesFromDir(this._commandDir);

    filenames.forEach((filename) => {
      const _filename = filename.split(".").shift();

      if (!_filename) {
        throw new LogicalException(
          "Error registering file " + this._commandDir
        );
      }

      if (!this.isExportCommandsKey(_filename)) {
        throw new TypeException("Error registering file " + this._commandDir);
      }

      this.commands.set(commands[_filename].data().name, commands[_filename]);
    });

    return this;
  }

  async registerCommands() {
    this.collectCommands();

    try {
      console.log(`Started refreshing application (/) commands.`);

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = isProd ? await this.commandProd() : await this.commandDev();

      console.log(
        `Successfully reloaded ${data.length} of ${this.commands.size} application (/) commands.`
      );
    } catch (err) {
      throw err;
    }

    return this;
  }

  async commandDev() {
    const data = await rest.put(
      Routes.applicationGuildCommands(DC_APP_ID, DC_GUILD_ID),
      {
        body: this.commands.map((command) => command.data()),
      }
    );

    this.assertResponseAsArray(data);

    return data;
  }

  async commandProd() {
    const data = await rest.put(Routes.applicationCommands(DC_APP_ID), {
      body: this.commands.map((command) => command.data()),
    });

    this.assertResponseAsArray(data);

    return data;
  }

  isExportCommandsKey(filename: unknown): filename is ExportCommandsKey {
    return Object.keys(commands).some((command) => filename === command);
  }

  assertResponseAsArray(
    value: unknown
  ): asserts value is RESTApplicationCommandsResponse[] {
    if (!Array.isArray(value))
      throw new AssertException(
        `Expected to be Array, but got this instead : ${JSON.stringify(value)}`
      );
  }
}
