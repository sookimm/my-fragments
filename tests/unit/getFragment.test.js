// tests/unit/getFragment.test.js

const request = require('supertest');
const express = require('express');
const getFragment = require('../../src/routes/api/getFragment');
const { Fragment } = require('../../src/model/fragment');
const logger = require('../../src/logger');

// Mock the Fragment model
jest.mock('../../src/model/fragment');
jest.mock('../../src/logger');

const app = express();

// Middleware to mock user authentication
app.use((req, res, next) => {
  req.user = 'user1';
  next();
});

app.get('/v1/fragments/:id', getFragment);

describe('GET /v1/fragments/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a fragment if found', async () => {
    const fragmentData = { id: 'fragment1', ownerId: 'user1', type: 'text/plain', size: 0 };
    Fragment.byId.mockResolvedValueOnce(fragmentData);

    const res = await request(app)
      .get('/v1/fragments/fragment1')
      .set('Authorization', 'Bearer token');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'ok',
      fragment: fragmentData,
    });
    expect(Fragment.byId).toHaveBeenCalledWith('user1', 'fragment1');
  });

  test('should handle errors gracefully', async () => {
    Fragment.byId.mockRejectedValueOnce(new Error('Unable to fetch fragment'));

    const res = await request(app)
      .get('/v1/fragments/fragment1')
      .set('Authorization', 'Bearer token');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      status: 'error',
      error: 'Unable to fetch fragment',
    });
    expect(logger.error).toHaveBeenCalledWith('Error fetching fragment', {
      error: 'Unable to fetch fragment',
    });
  });
});
