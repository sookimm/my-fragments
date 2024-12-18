const request = require('supertest');

const app = require('../../src/app');
const { listFragments } = require('../../src/model/data/memory/index');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app).get('/v1/fragments').auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  // TODO: we'll need to add tests to check the contents of the fragments array later
  test('expand=1 returns expanded fragment metadata for an authenticated user', async () => {
    const data = Buffer.from('This is fragment');
    await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text-plain')
      .auth('user1@email.com', 'password1')
      .send(data);

    await request(app)
      .post('/v1/fragments')
      .set('Content-type', 'text-plain')
      .auth('user1@email.com', 'password1')
      .send(data);
    var result = await listFragments('user1@email.com', 1);

    const res = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragments).toEqual(result);
  });
});
