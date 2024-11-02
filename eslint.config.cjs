module.exports = {
  env: {
    node: true,
    jest: true,
    es2021: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": "warn",
  },
};
