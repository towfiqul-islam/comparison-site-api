const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get('/', async (req, res) => {
  res.json({
    status: `Automation working from ${process.env.LOCATION}`,
  });
});

let cachedDbPool;
function getDbPool() {
  if (!cachedDbPool) {
    cachedDbPool = mysql.createPool({
      connectionLimit: 1,
      user: process.env.SQL_USER,
      database: process.env.SQL_NAME,
      socketPath: `/cloudsql/${process.env.INST_CON_NAME}`,
    });
  }
  return cachedDbPool;
}

app.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const phone = await getPhone(id);
  res.json({status: 'Success', data: {phone: phone}});
});

async function getPhone(id) {
  return new Promise(function (resolve, reject) {
    const sql = 'SELECT * FROM phones WHERE id = ?';
    getDbPool().query(sql, [id], (err, results) => {
      resolve(results[0]);
    });
  });
}

app.post('/', async (req, res) => {
  const id = await createPhone(req.body);
  const phone = await getPhone(id);
  res.json({status: 'Phone added', data: {phone: phone}});
});

function createPhone(fields) {
  return new Promise(function (resolve, reject) {
    const sql = 'INSERT INTO phones SET ?';
    getDbPool().query(sql, fields, (err, results) => {
      resolve(results.insertId);
    });
  });
}
