// tests/unit/getById.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/111').expect(401));

  // Return 404 if the fragment does not exist
  test('return 404 for non-existing fragment', async () => {
    const res = await request(app).get('/v1/fragments/11').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  test('authenticated users get a fragment array', async () => {
    const data = Buffer.from('This is a fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes1 = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
  });

  test('convert md to html and txt', async () => {
    const data = Buffer.from('# This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes1 = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    const getRes2 = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(getRes2.statusCode).toBe(200);
  });

  test('convert html to txt', async () => {
    const data = Buffer.from('<h1>This is a fragment</h1>');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes1 = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
    const getRes2 = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(getRes2.statusCode).toBe(200);
  });

  test('convert html to txt', async () => {
    const data = JSON.parse('{"name":"Terry"}');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const getRes1 = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(getRes1.statusCode).toBe(200);
  });
});
