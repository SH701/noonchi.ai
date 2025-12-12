import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["dist/**", ".next/**", "node_modules/**", "out/**", "build/**"],
    plugins: {
      "@next/next": nextPlugin,
      "@tanstack/query": tanstackQuery,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        alert: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        React: "readonly",

        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@tanstack/query/exhaustive-deps": "error",
    },
  },
  prettier
);
