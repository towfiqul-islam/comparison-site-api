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
