// tests/unit/logger.test.js

const pino = require('pino');
jest.mock('pino');

describe('Logger', () => {
  let logger;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    pino.mockImplementation(() => ({
      error: consoleErrorSpy,
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should log error messages', () => {
    const errorMessage = 'Test error message';
    logger = require('../../src/logger');
    logger.error(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(errorMessage);
  });

  test('should set pino-pretty for debug level', () => {
    process.env.LOG_LEVEL = 'debug';
    const pinoPretty = require('pino-pretty');
    jest.mock('pino-pretty');

    pino.mockImplementation((options) => {
      expect(options).toHaveProperty('transport');
      expect(options.transport).toHaveProperty('target', 'pino-pretty');
      expect(options.transport.options).toHaveProperty('colorize', true);
      return {
        error: consoleErrorSpy,
      };
    });

    logger = require('../../src/logger');
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Test error message');
  });
});
