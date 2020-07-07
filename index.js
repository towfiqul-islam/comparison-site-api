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

app.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const phone = await getPhone(id);
  res.json({status: 'Success', data: {phone: phone}});
});

let cachedDbPool;
function getDbPool() {
  if (!cachedDbPool) {
    mysql.createPool({
      connectionLimit: 1,
      user: process.env.SQL_USER,
      database: process.env.SQL_NAME,
      socketPath: `/cloudsql/${process.env.INST_CON_NAME}`,
    });
  }
  return cachedDbPool;
}

const getPhone = async id => {
  return new Promise(function (resolve, reject) {
    const sql = 'SELECT * FROM phones WHERE id = ?';
    getDbPool().query(sql, [id], (err, results) => {
      resolve(results[0]);
    });
  });
};
