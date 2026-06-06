import { default as ping } from "./ping";
import { default as hero } from "./hero";
import { default as profile } from "./profile";
import { default as join } from "./join";
import { default as delete_account } from "./delete-account";
import { default as help } from "./help";
import { default as my_heroes } from "./my-heroes";
import { default as quest } from "./quest";
import { default as summon } from "./summon";

const commands = {
  "delete-account": delete_account,
  ping,
  hero,
  profile,
  join,
  help,
  "my-heroes": my_heroes,
  quest,
  summon,
};

export type ExportCommandsKey = keyof typeof commands;

type ExportCommands = {
  [key in ExportCommandsKey]: (typeof commands)[key];
};

export default commands as ExportCommands;
