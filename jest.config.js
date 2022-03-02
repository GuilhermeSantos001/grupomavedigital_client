/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const {
  resolve
} = require('path');

module.exports = {
  roots: ['<rootDir>'],
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
    "^@/bin/(.+)$": "<rootDir>/bin/$1",
    "^@/app/(.+)$": "<rootDir>/app/$1",
    "^@/middlewares/(.+)$": "<rootDir>/middlewares/$1",
    "^@/services/(.+)$": "<rootDir>/services/$1",
    "^@/types/(.+)$": "<rootDir>/types/$1",
    "^@/constants/(.+)$": "<rootDir>/constants/$1",
    "^@/controllers/(.+)$": "<rootDir>/controllers/$1",
    "^@/context/(.+)$": "<rootDir>/context/$1",
    "^@/lib/(.+)$": "<rootDir>/lib/$1",
    "^@/components/(.+)$": "<rootDir>/components/$1",
    "^@/pages/(.+)$": "<rootDir>/pages/$1",
    "^@/src/(.+)$": "<rootDir>/src/$1",
    "^@/styles/(.+)$": "<rootDir>/styles/$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/cypress/"],
  setupFiles: [resolve(__dirname, './test/setup-test.ts')],
}