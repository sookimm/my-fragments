// tests/unit/getByIdInfo.js

const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('return 404 if there is no matched id', async () => {
    var id = 1;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(404);
  });

  test('authenticated users get a specific fragment matched with given id', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('user1@email.com', 'password1');
    expect(getRes.statusCode).toBe(200);
  });
});
