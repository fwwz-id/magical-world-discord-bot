import { defineConfig } from "rollup";

import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  input: "src/index.ts",
  output: {
    dir: "build",
    format: "cjs",
  },
  plugins: [
    typescript({
      module: "esnext",
    }),
    process.env.NODE_ENV == "production" && terser(),
  ],
  external: [
    "dotenv/config",
    "discord.js",
    "module-alias/register",
    "@prisma/client",
    "@prisma/extension-accelerate",
    "path",
    "fs",
  ],
});
