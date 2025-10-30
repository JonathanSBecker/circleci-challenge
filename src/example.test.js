const request = require('supertest');

describe('example', () => {
  it('should be integrated', async () => {
    process.env.MYSQL2_URL = 'localhost';
    process.env.MYSQL2_USER = 'root';
    process.env.MYSQL2_PASSWORD = 'password';
    process.env.MYSQL2_DATABASE = 'dbmate_demo';

    const app = require('./index');
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
