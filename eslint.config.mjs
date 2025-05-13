import eslint from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import prettierPlugin from "eslint-plugin-prettier";

export default [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tsParser,
      globals: {
        ...globals.node,
      }
    },
    files: ["src/**/*.{ts,js}"],
    ignores: ["**/*.test.ts"],
    plugins: {
      "@typescript-eslint": tsPlugin,
      "simple-import-sort": simpleImportSort,
      "prettier": prettierPlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...prettierConfig.rules,
      "no-console": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "simple-import-sort/imports": [
        "error",
        {
          "groups": [
            ["^@?\\w"],
            ["^\\."],
            ["^\\u0000"]
          ]
        }
      ],
      "simple-import-sort/exports": "warn",
      "prettier/prettier": "warn",
    },
  },
];
