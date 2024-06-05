// tests/unit/app.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('App', () => {
  test('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'not found',
        code: 404,
      },
    });
  });
});
