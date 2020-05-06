module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended",
    "@vue/prettier",
    "prettier",
  ],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/require-v-for-key": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-unused-vars": "warn",
    "vue/no-unused-vars": "warn",
    "vue/require-prop-types": "off",
  },
};
