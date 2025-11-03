const request = require('supertest');

describe('example', () => {
  it('should be integrated', async () => {
    process.env.MYSQL2_URL = 'localhost';
    process.env.MYSQL2_USER = 'test_user';
    process.env.MYSQL2_PASSWORD = 'bad_password_practices';
    process.env.MYSQL2_DATABASE = 'dbmate_demo';

    const app = require('./index');
    const res = await request(app)
      .post('/')
      .set("Content-Type", "application/json")
      .send({ name: 'test' });

    expect(res.body).toBeDefined();
    expect(res.body.example).toBeDefined();
    expect(res.body.example.name).toBe('test');
    expect(res.body.example.uuid).toBeDefined();
  });
});
