module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
  },
};
