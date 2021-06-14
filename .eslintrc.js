module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    // '@vue/airbnb',
    '@vue/typescript',
  ],

  settings: {
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },

  parserOptions: {
    parser: '@typescript-eslint/parser',
  },

  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
