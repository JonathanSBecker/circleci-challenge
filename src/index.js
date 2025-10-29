const dotenv = require('dotenv');
const express = require('express');
const mysql = require('mysql2/promise');

// DB LAYER
dotenv.config();
const { MYSQL2_URL, MYSQL2_USER, MYSQL2_PASSWORD, MYSQL2_DATABASE } =
    process.env;

if (!MYSQL2_URL || !MYSQL2_USER || !MYSQL2_PASSWORD || !MYSQL2_DATABASE) {
  process.exit(20);
}

let pool = null;

const getPool = async () => {
  if (!pool) {
    try {
      pool = mysql.createPool({
        host: MYSQL2_URL,
        user: MYSQL2_USER,
        password: MYSQL2_PASSWORD,
        database: MYSQL2_DATABASE,
        connectionLimit: 10,
        idleTimeout: 15000,
      });
    } catch (error) {
      throw new Error('Unable to connect to mysql');
    }
  }
  return pool;
};

const getConnection = async () => {
  const pool = await getPool();
  return pool.getConnection();
};

const convertDate = (date) => {
  return date.toISOString().slice(0, 23).replace('T', ' ');
};

const now = () => {
  return convertDate(new Date());
};

const formatNamedParameters = (sql, params) => {
  const values = [];
  const newSql = sql.replace(/:\w+/g, match => {
    const paramName = match.slice(1);
    if (!(paramName in params)) {
      throw new SystemError(`Parameter '${paramName}' is missing`);
    }

    const paramValue = params[paramName];
    if (paramValue === undefined) {
      values.push(null);
      return '?';
    }
    if (Array.isArray(paramValue)) {
      const placeholders = paramValue.map(() => '?').join(', ');
      values.push(...paramValue);
      return placeholders;
    } else if (paramValue instanceof Date) {
      values.push(convertDate(paramValue));
      return '?';
    } else {
      values.push(paramValue);
      return '?';
    }
  });
  return { sql: newSql, values };
};

const query = async (transaction) => {
  const connection = await getConnection();
  const { sql, values } = formatNamedParameters(
      transaction.sql,
      transaction.params,
  );
  const [rows] = await connection.query(sql, values);
  connection.release();
  return rows[0];
};

const queryArray = async (transaction) => {
  const connection = await getConnection();
  const { sql, values } = formatNamedParameters(
      transaction.sql,
      transaction.params,
  );
  const [rows] = await connection.query(sql, values);
  connection.release();
  return rows;
};

const execute = async (transaction) => {
  const connection = await getConnection();
  const { sql, values } = formatNamedParameters(
      transaction.sql,
      transaction.params,
  );
  await connection.execute(sql, values);
  connection.release();
};

const generateUuid = () => {
  let uuid = '';
  for (let i = 0; i < 8; i += 1) {
    const num = Math.floor(Math.random() * 65536);
    uuid += num.toString(16);
    if (i === 1 || i === 2 || i === 3 || i === 4) {
      uuid += '-';
    }
  }
  return uuid;
}

// SERVICE LAYER
const app = express();
app.use(express.json());

// ENDPOINTS
app.post('/', async (req, res) => {
  const uuid = generateUuid();
  await execute({
    sql: `
    insert into example (
      uuid,
      name,
      createdAt,
      updatedAt
    ) values (
      :uuid,
      :name,
      :now,
      :now)`,
    params: {
      uuid: uuid,
      name: req.body.name,
      now: now()
    }
  });

  const example = await query({
    sql: `SELECT * FROM example
          WHERE uuid = :uuid`,
    params: { uuid }
  });

  if (!example) {
    return res.status(500).json({ message: 'Unable to create example '});
  }

  return res.status(201).json({ example });
});

app.get('/', async (req, res) => {
  const examples = await queryArray({
    sql: `SELECT * FROM example`,
    params: {}
  })

  return res.status(200).json({ examples });
});

app.listen(3000, () => {
  console.log('Open on port 3000');
});
