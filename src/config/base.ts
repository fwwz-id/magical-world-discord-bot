import { LogicalException } from "../exception";

const BASE_CONF = {
  DC_APP_ID: process.env.APPLICATION_ID,
  DC_GUILD_ID: process.env.GUILD_ID,
  DC_BOT_TOKEN: process.env.BOT_TOKEN,
  DC_PUBLIC_KEY: process.env.PUBLIC_KEY,
};

class BaseConfig {
  static dc_app_id() {
    if (!BASE_CONF.DC_APP_ID) {
      throw new LogicalException("DC_APP_ID not configured correctly");
    }

    return BASE_CONF.DC_APP_ID;
  }

  static dc_guild_id() {
    if (!BASE_CONF.DC_GUILD_ID) {
      throw new LogicalException("DC_GUILD_ID not configured correctly");
    }

    return BASE_CONF.DC_GUILD_ID;
  }

  static dc_bot_token() {
    if (!BASE_CONF.DC_BOT_TOKEN) {
      throw new LogicalException("DC_BOT_TOKEN not configured correctly");
    }

    return BASE_CONF.DC_BOT_TOKEN;
  }

  static dc_pubkey() {
    if (!BASE_CONF.DC_PUBLIC_KEY) {
      throw new LogicalException("DC_PUBLIC_KEY not configured correctly");
    }

    return BASE_CONF.DC_PUBLIC_KEY;
  }
}

export const DC_APP_ID = BaseConfig.dc_app_id();
export const DC_GUILD_ID = BaseConfig.dc_guild_id();
export const DC_BOT_TOKEN = BaseConfig.dc_bot_token();
export const DC_PUBKEY = BaseConfig.dc_pubkey();

export const NODE_ENV = process.env.NODE_ENV;
