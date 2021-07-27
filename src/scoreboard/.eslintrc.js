module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-use-before-define": 0,
    "react/prop-types": 0,
    "react/jsx-filename-extension": 0,
    "no-console": 0,
    "no-nested-ternary": 0,
    quotes: ["error", "double"],

    // these conflict with prettier settings
    "react/jsx-one-expression-per-line": 0,
    "no-confusing-arrow": 0,
    "implicit-arrow-linebreak": 0,
    "object-curly-newline": 0,
    "prefer-arrow-callback": 0,
    "react/jsx-props-no-spreading": 0,
    indent: 0,
  },
};
