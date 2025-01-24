import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    }
  }
];