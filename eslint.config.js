// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // react-hooks/immutability flags Reanimated's `sharedValue.value = ...`
    // assignment as an illegal mutation, but that assignment is Reanimated's
    // documented public API (not React state) — false positive.
    rules: {
      "react-hooks/immutability": "off",
    },
  },
]);
