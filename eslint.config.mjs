import globals from "globals";
import pluginJs from "@eslint/js";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
      },
      globals: {
        ...globals.browser
      }
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: {
      // JavaScript rules
      "eqeqeq": "off",
      "no-unused-vars": "error",
      "max-len": ["warn", { code: 200 }],
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
      "no-use-before-define": "off",

      // TypeScript rules
      "@typescript-eslint/no-use-before-define": ["error"],
    },
  },
];