import eslint from "@eslint/js";
import globals from "globals";

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "Sequelize",
          argsIgnorePattern: "next",
        },
      ],
    },
  },
  {
    files: ["**/migrations/**", "**/seeders/**"],
    rules: {
      "no-unused-vars": "off",
    },
  },
];
