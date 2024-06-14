// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

jest.mock('../../src/model/fragment', () => {
  return {
    __esModule: true,
    Fragment: jest.fn().mockImplementation(() => ({
      save: jest.fn(),
      setData: jest.fn(),
    })),
  };
});

describe('POST /v1/fragments', () => {
  beforeEach(() => {
    Fragment.mockClear();
  });

  test('should create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user', 'password')
      .set('Content-Type', 'text/plain')
      .send('plain text data');

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toMatch(/\/v1\/fragments\/generated-id$/);
    expect(res.body.fragment).toBeDefined();
  });

  test('should return 400 for unsupported content type', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user', 'password')
      .set('Content-Type', 'application/octet-stream')
      .send(Buffer.from('binary data'));

    expect(res.statusCode).toBe(400);
  });
});
