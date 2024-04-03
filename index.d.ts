declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      APPLICATION_ID?: string;
      GUILD_ID?: string;
      PUBLIC_KEY?: string;
      BOT_TOKEN?: string;
      DATABASE_URL?: string;
      DIRECT_URL?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
