import { NODE_ENV } from "@config/base";

export const isProd = NODE_ENV == "production";
export const isDev = NODE_ENV == "development";

export function isString(value: unknown): value is string {
  if (typeof value == "string" || value != "") return true;

  return false;
}
