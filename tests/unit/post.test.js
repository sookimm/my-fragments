const request = require('supertest');

const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // unauthenticated requests
  test('unauthenticated requests', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(401);
  });

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).post('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Trying to create a fragment with an unsupported type errors as expected
  test('Incorrect types', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'abd/dasda')
      .send(data);
    expect(res.statusCode).toBe(415);
  });

  test('authenticated users create a plain text fragment', async () => {
    const data = Buffer.from('This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/plain'));
  });

  test('authenticated users create a markdown text fragment', async () => {
    const data = Buffer.from('# This is fragment');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/markdown')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/markdown'));
  });

  test('authenticated users create a html text fragment', async () => {
    const data = Buffer.from('<h1> This is fragment </h1>');
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/html')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.text.includes('text/html'));
  });

  test('authenticated users create a json fragment', async () => {
    const data = Buffer.from("{'name': 'Terry'}");
    const res = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'application/json')
      .send(data);
    expect(res.statusCode).toBe(201);
    expect(res.text.includes('application/json'));
  });
});
