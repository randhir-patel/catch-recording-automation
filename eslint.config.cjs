/* eslint-disable @typescript-eslint/no-require-imports */
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  recommendedConfig: true,
});

module.exports = [
  ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'),
  {
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-types': 'off',
    },
  },
];
