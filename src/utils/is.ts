import { NODE_ENV } from "@config/base";

export const isProd = NODE_ENV == "production";
export const isDev = NODE_ENV == "development";
