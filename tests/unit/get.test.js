// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const { Fragment } = require('../../src/model/fragment');

describe('GET /v1/fragments/:id', () => {
  beforeAll(async () => {
    const fragment = new Fragment({
      id: 'fragment1',
      ownerId: 'user1@email.com',
      type: 'text/plain',
      size: 0,
    });
    await fragment.save();
  });

  test('GET /v1/fragments/:id returns specific fragment data', async () => {
    const res = await request(app)
      .get('/v1/fragments/fragment1')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment).toBeDefined();
  });
});

describe('GET /v1/fragments', () => {
  beforeAll(async () => {
    const fragment1 = new Fragment({
      id: 'fragment1',
      ownerId: 'user1@email.com',
      type: 'text/plain',
      size: 0,
    });
    const fragment2 = new Fragment({
      id: 'fragment2',
      ownerId: 'user1@email.com',
      type: 'text/plain',
      size: 0,
    });
    await fragment1.save();
    await fragment2.save();
  });

  test('should fetch fragments for user', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toHaveLength(2);
  });

  test('should handle errors when fetching fragments', async () => {
    jest.spyOn(Fragment, 'byUser').mockImplementation(() => {
      throw new Error('Test error');
    });

    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBe('Unable to fetch fragments');
  });
});
