const express = require('express');
const { query, queryArray, execute, now } = require('./db');

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

module.exports = app;
