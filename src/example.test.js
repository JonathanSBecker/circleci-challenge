const request = require('supertest');
const app = require('./index');

describe('example', () => {
  it('should be integrated', async () => {
    const res = await request(app)
      .post('/')
      .set("Content-Type", "application/json")
      .send({ name: 'test' })
      .expect("Content-Type", /json/)
      .expect(201);

    expect(res.body).toBeDefined();
    expect(res.body.example).toBeDefined();
    expect(res.body.example.name).toBe('test');
    expect(res.body.example.uuid).toBeDefined();
  });
});
