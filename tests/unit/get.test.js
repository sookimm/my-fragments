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
