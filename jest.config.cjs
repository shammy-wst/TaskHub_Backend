module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  moduleNameMapper: {
    "^../utils/logger$": "<rootDir>/tests/mocks/logger.js",
    "^bcrypt$": "<rootDir>/tests/mocks/bcrypt.js",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/mocks/"],
};
