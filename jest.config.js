module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.vue'],
  transform: {
    '.+\\.(css)$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '.+\\.(css)$': 'jest-transform-stub',
  },
};
