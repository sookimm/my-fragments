// tests/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

jest.mock('../../src/model/fragment', () => {
  const originalModule = jest.requireActual('../../src/model/fragment');
  return {
    __esModule: true,
    ...originalModule,
    Fragment: jest.fn().mockImplementation(() => ({
      id: 'generated-id',
      save: jest.fn().mockImplementation(() => {
        console.log('Mock save called');
      }),
      setData: jest.fn(),
      getData: jest.fn(),
    })),
  };
});

describe('POST /v1/fragments', () => {
  beforeEach(() => {
    Fragment.mockClear();
    Fragment.isSupportedType = jest.fn().mockReturnValue(true); // isSupportedType method mocking
  });

  test('should create a plain text fragment', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1') // Add authentication info
      .set('Content-Type', 'text/plain')
      .send('plain text data');

    console.log('Response:', res.body); // Add response log

    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toMatch(/\/v1\/fragments\/generated-id$/);
    expect(res.body.fragment).toBeDefined();
  });

  test('should return 400 for unsupported content type', async () => {
    Fragment.isSupportedType.mockReturnValue(false); // Set to unsupported content type

    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1') // Add authentication info
      .set('Content-Type', 'application/octet-stream')
      .send(Buffer.from('binary data'));

    console.log('Response:', res.body); // Add response log

    expect(res.statusCode).toBe(400);
  });
});
