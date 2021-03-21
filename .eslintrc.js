/* eslint-env node */
module.exports = {
  "env": {
    "browser": true,
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "@typescript-eslint/ban-types": ["error",
    {
      "types": {
        "Function": false,
      },
      "extendDefaults": true,
    }],
  },
};
