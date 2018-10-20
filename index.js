const express = require('express'),
      mysql   = require('mysql');

const app = express();

const connection = mysql.createConnection({
  host:     'db',
  user:     process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.use(express.static(__dirname + '/public'));

app.get('/api/session/', (req, res) => {
  connection.connect();
  res.json([ 'test' ]);
});

app.listen('3000');
