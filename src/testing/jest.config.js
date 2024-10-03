module.exports = {
  // Specify the test environment
  testEnvironment: 'jsdom',

  // Specify the root directory for tests
  roots: ['<rootDir>/src'],

  // Specify the test match pattern
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  // Specify the transform for TypeScript files
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },

  // Specify the file extensions Jest should look for
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Specify the setup files to run after the test environment is set up
  setupFilesAfterEnv: ['<rootDir>/src/testing/setup.ts'],

  // Specify the directory for code coverage output
  coverageDirectory: '<rootDir>/coverage',

  // Specify which files to collect coverage from
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts'
  ],

  // Specify module name mapper for @ alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Specify test path ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Specify global configuration for ts-jest
  globals: {
    'ts-jest': {
      tsconfig: 'src/testing/tsconfig.json'
    }
  },

  // Verbose output
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    "json",
    "text",
    "lcov",
    "clover"
  ],

  // The maximum amount of workers used to run your tests
  maxWorkers: "50%",

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules",
    "src"
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "/node_modules/"
  ],

  // This option allows the use of a custom results processor
  // testResultsProcessor: undefined,

  // This option allows use of a custom test runner
  // testRunner: "jest-circus/runner",

  // A map from regular expressions to paths to transformers
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/",
    "\\.pnp\\.[^\\/]+$"
  ],
};