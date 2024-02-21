import { default as ping } from "./ping";
import { default as hero } from "./hero";

const commands = {
  ping,
  hero,
};

export type ExportCommandsKey = keyof typeof commands;

type ExportCommands = {
  [key in ExportCommandsKey]: (typeof commands)[key];
};

export default commands as ExportCommands;
