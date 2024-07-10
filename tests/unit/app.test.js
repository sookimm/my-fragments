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

  test('should handle server errors gracefully', async () => {
    const res = await request(app).get('/trigger-error');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      error: {
        message: 'Test Error',
        code: 500,
      },
    });
  });
});
