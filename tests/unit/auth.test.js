// tests/unit/auth.test.js

const { strategy } = require('../../src/auth/basic-auth');

describe('Basic Auth', () => {
  test('should handle missing HTPASSWD_FILE gracefully', () => {
    const originalEnv = process.env.HTPASSWD_FILE;
    delete process.env.HTPASSWD_FILE;

    expect(() => strategy()).toThrow('missing expected env var: HTPASSWD_FILE');

    process.env.HTPASSWD_FILE = originalEnv;
  });
});
