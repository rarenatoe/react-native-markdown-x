import js from "@eslint/js";
import tseslint from "typescript-eslint";
import ImportXPlugin, { importX } from "eslint-plugin-import-x";

import babelParser from "@babel/eslint-parser";
import BabelPlugin from "@babel/eslint-plugin";
import reactX from "eslint-plugin-react-x";
import ReactNativePlugin from "eslint-plugin-react-native";
import ReactHooksPlugin from "eslint-plugin-react-hooks";
import typescriptParser from "@typescript-eslint/parser";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ImportXPlugin.flatConfigs.recommended,
  // IGNORED FILES: The `ignores` property must be in a separate object to function correctly for all files.
  {
    ignores: ["babel.config.js"],
  },
  {
    files: ["**/*.{js,jsx,cjs,mjs}"],
    extends: [ReactHooksPlugin.configs["recommended-latest"]],
    settings: {
      "import-x/resolver": { typescript: true, node: true },
      react: { version: "detect" },
    },
    plugins: {
      "@babel": BabelPlugin,
      "react-native": ReactNativePlugin,
    },
    languageOptions: {
      globals: { ...globals.browser },
      parser: babelParser,
    },
  },
  {
    files: ["**/*.{ts,tsx,cts,mts}"],
    extends: [
      tseslint.configs.strictTypeChecked,
      reactX.configs["recommended-type-checked"],
      importX.flatConfigs.typescript,
    ],
    settings: {
      react: { version: "detect" },
      "import-x/resolver": {
        typescript: true,
      },
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  }
);
