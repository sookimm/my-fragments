// tests/unit/routes-index.test.js

const request = require('supertest');
const express = require('express');
const router = require('../../src/routes');
const { createSuccessResponse } = require('../../src/response');
const { authenticate } = require('../../src/auth');

jest.mock('../../src/response');
jest.mock('../../src/auth', () => ({
  authenticate: jest.fn(() => (req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Routes', () => {
  test('GET /health', async () => {
    createSuccessResponse.mockImplementation((res, body) => res.status(200).json(body));

    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      author: 'Sooyeon Kim',
      githubUrl: 'https://github.com/sookimm/fragments',
      version: '0.7.0',
    });
    expect(createSuccessResponse).toHaveBeenCalled();
  });

  test('should use authenticate middleware for /v1 routes', async () => {
    const res = await request(app).get('/v1/any-route');
    expect(authenticate).toHaveBeenCalled();
    // Since we are not mocking the actual /v1/any-route, it will return 404
    expect(res.status).toBe(404);
  });
});
