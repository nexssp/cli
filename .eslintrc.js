// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  parserOptions: {
    env: {
      node: true
      // browser: true,
      // es6: true
    },

    ecmaVersion: 9,
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      jsx: true
    },
    parser: "babel-eslint"
  },
  extends: [
    "eslint:recommended",
    "plugin:node/recommended",
    "plugin:security/recommended"
  ],
  plugins: ["security", "mocha"],
  rules: {
    "no-console": 0,
    "node/exports-style": ["error", "module.exports"],
    "node/file-extension-in-import": ["error", "always"],
    "node/prefer-global/buffer": ["error", "always"],
    "node/prefer-global/console": ["error", "always"],
    "node/prefer-global/process": ["error", "always"],
    "node/prefer-global/url-search-params": ["error", "always"],
    "node/prefer-global/url": ["error", "always"],
    "node/prefer-promises/dns": "error",
    "node/prefer-promises/fs": "error"
  }
};
