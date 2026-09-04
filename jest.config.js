module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^react-native/setup-env$': '<rootDir>/node_modules/@react-native/jest-preset/jest/mocks/InitializeCore.js',
  },
};
