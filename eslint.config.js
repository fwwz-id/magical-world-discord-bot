// @ts-check

const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");

module.exports = tseslint.config(
  eslint.configs.recommended,
  {
    ignores: ["build/*", "**/*.js"],
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-useless-catch": ["off"],
      "@typescript-eslint/no-explicit-any": ["warn"],
    },
  }
);
