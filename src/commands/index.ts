import { default as ping } from "./ping";
import { default as hero } from "./hero";
import { default as profile } from "./profile";
import { default as join } from "./join";

const commands = {
  ping,
  hero,
  profile,
  join,
};

export type ExportCommandsKey = keyof typeof commands;

type ExportCommands = {
  [key in ExportCommandsKey]: (typeof commands)[key];
};

export default commands as ExportCommands;
