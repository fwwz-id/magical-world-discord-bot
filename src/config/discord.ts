import { Client, GatewayIntentBits, REST as Api } from "discord.js";

import { DC_BOT_TOKEN } from "./base";

export const DEFAULT_CLIENT = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export const rest = new Api().setToken(DC_BOT_TOKEN);
