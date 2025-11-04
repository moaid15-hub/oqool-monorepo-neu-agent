/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest preset for TypeScript
  preset: 'ts-jest',

  // Test environment
  testEnvironment: 'node',

  // Root directory
  rootDir: '.',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Coverage collection
  collectCoverageFrom: [
    'packages/*/src/**/*.{ts,tsx}',
    '!packages/*/src/**/*.d.ts',
    '!packages/*/src/**/*.test.ts',
    '!packages/*/src/**/*.spec.ts',
  ],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Coverage reporters
  coverageReporters: ['text', 'lcov', 'html'],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Module name mapper for package aliases
  moduleNameMapper: {
    '^@oqool/shared/(.*)$': '<rootDir>/packages/shared/src/$1',
    '^@oqool/shared$': '<rootDir>/packages/shared/src/index.ts',
    '^@oqool/cli/(.*)$': '<rootDir>/packages/cli/src/$1',
    '^@oqool/cli$': '<rootDir>/packages/cli/src/index.ts',
  },

  // Transform files with ts-jest
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },

  // File extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/__tests__/**/*.tsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.spec.ts',
    '**/*.spec.tsx',
  ],

  // Setup files
  setupFilesAfterEnv: [],

  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/', '/lager/'],
  modulePathIgnorePatterns: ['/lager/', '/dist/', '/build/'],

  // Verbose output
  verbose: true,

  // ESM support
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
