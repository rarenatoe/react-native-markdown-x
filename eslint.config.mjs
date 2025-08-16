import js from "@eslint/js";
import globals from "globals";
import eslintPluginReact from "eslint-plugin-react-x";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { importX } from "eslint-plugin-import-x";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
  {
    ignores: ["node_modules/", "lib/", "example/"],
  },
  js.configs.recommended,
  importX.flatConfigs.recommended,
  {
    files: ["babel.config.js", "**/metro.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      eslintPluginReact.configs["recommended-type-checked"],
      eslintPluginReactHooks.configs["recommended-latest"],
      importX.flatConfigs.typescript,
    ],
    settings: {
      "react": { version: "detect" },
      "import-x/resolver": {
        typescript: true,
      },
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      "no-else-return": "error",
    },
  },
  eslintConfigPrettier,
);
