// tests/unit/logger.test.js

const pino = require('pino');

jest.mock('pino');

describe('Logger', () => {
  let logger;
  let consoleErrorSpy;
  let consoleInfoSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
    pino.mockImplementation(() => ({
      error: consoleErrorSpy,
      info: consoleInfoSpy,
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

  test('should log info messages', () => {
    const infoMessage = 'Test info message';
    logger.info(infoMessage);
    expect(consoleInfoSpy).toHaveBeenCalled();
    expect(consoleInfoSpy.mock.calls[0][0]).toContain(infoMessage);
  });
});
