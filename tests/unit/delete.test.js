// tests/unit/delete.test.js

const request = require('supertest');

const app = require('../../src/app');
//const logger = require('../../src/logger');

describe('DELETE /v1/fragments/:id', () => {
  // Using a valid username/password pair with correct fragment id
  test('authenticated users deletes a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(200);
  });

  test('unauthenticated users deletes a fragment', async () => {
    const data = Buffer.from('This is fragment');
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = JSON.parse(postRes.text).fragment.id;
    const deleteRes = await request(app).delete(`/v1/fragments/${id}`);
    expect(deleteRes.statusCode).toBe(401);
  });
  test('authenticated users deletes an nonexisting fragment', async () => {
    const data = Buffer.from('This is fragment');
    await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('Content-Type', 'text/plain')
      .send(data);
    var id = 1;
    const deleteRes = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1');
    expect(deleteRes.statusCode).toBe(404);
    //expect(deleteRes.text).toBe(data.toString());
  });
});
