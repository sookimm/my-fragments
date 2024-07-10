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
    logger = require('../../src/logger');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should log error messages', () => {
    const errorMessage = 'Test error message';
    logger.error(errorMessage);
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain(errorMessage);
  });
});
