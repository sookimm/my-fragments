// tests/unit/auth-index.test.js

describe('Auth Index', () => {
  let originalEnv;

  beforeEach(() => {
    // Save the original environment variables
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore the original environment variables after each test
    process.env = originalEnv;
  });

  test('should handle missing env vars gracefully', () => {
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;

    // Clear the require cache
    jest.resetModules();

    expect(() => require('../../src/auth')).toThrow(
      'missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID or HTPASSWD_FILE'
    );
  });
});
