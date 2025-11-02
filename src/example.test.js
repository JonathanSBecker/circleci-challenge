const request = require('supertest');

describe('example', () => {
  it('should be integrated', async () => {
    process.env.MYSQL2_URL = 'localhost';
    process.env.MYSQL2_USER = 'root';
    process.env.MYSQL2_PASSWORD = 'password';
    process.env.MYSQL2_DATABASE = 'dbmate_demo';

    const { execute } = require('./db');
    // if (process.env.NODE_ENV === 'circle') {
    //   await execute({
    //     sql: `DROP TABLE IF EXISTS example`,
    //     params: {}
    //   });
    //   await execute({
    //     sql: `
    //         CREATE TABLE example
    //         (
    //             uuid      VARCHAR(36)  NOT NULL,
    //             name      VARCHAR(255) NOT NULL,
    //             createdAt DATETIME(3)  NOT NULL,
    //             updatedAt DATETIME(3)  NOT NULL
    //         ) CHARSET utf8mb4
    //           ENGINE = InnoDB`
    //   });
    //   console.log('table creation successful');
    // }

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
