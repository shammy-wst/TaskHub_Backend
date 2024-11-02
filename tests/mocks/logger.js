const logger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  sql: jest.fn(),
};

module.exports = logger;
