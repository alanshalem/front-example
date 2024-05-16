module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      babelConfig: require('@galicia-toolkit/spa-build-config').babelConfig
        .testConfig,
    },
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  modulePaths: ['<rootDir>/'],
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  testPathIgnorePatterns: ['<rootDir>/.next', '<rootDir>/node_modules'],
  moduleNameMapper: {
    '^@lib(.*)$': '<rootDir>/lib/$1',
    '^@contexts(.*)$': '<rootDir>/contexts/$1',
    '^@components(.*)$': '<rootDir>/components/$1',
    '^@containers(.*)$': '<rootDir>/containers/$1',
  },
  setupFiles: ['./setupTests.js'],
};
