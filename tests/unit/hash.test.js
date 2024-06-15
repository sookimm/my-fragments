// tests/unit/hash.test.js

const { hashEmail } = require('../../src/hash');

describe('Hash Email', () => {
  test('should hash an email correctly', () => {
    const email = 'test@example.com';
    const hashedEmail = hashEmail(email);
    const expectedHash = '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b'; // Real hash value
    expect(hashedEmail).toBe(expectedHash);
  });
});
