import type { Client } from "discord.js";

import { DC_BOT_TOKEN } from "@config/base";
import { DEFAULT_CLIENT } from "@config/discord";

import { LogicalException } from "@exception/index";

export default class BotClient {
  private _client?: Client<boolean>;

  constructor(client: Client<boolean> = DEFAULT_CLIENT) {
    this._client = client;
  }

  get client() {
    if (!this._client) {
      throw new LogicalException("Discord Client not initialized correctly.");
    }

    return this._client;
  }

  login() {
    return this.client.login(DC_BOT_TOKEN);
  }
}
