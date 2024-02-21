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
    terser(),
  ],
  external: [
    "dotenv/config",
    "discord.js",
    "module-alias/register",
    "path",
    "fs",
  ],
});
