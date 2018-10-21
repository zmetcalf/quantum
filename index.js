const express = require('express'),
      mysql   = require('mysql'),
      _       = require('lodash');

const app = express();

const pool = mysql.createPool({
  host:     'db',
  user:     process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

app.use(express.static(__dirname + '/public'));

app.get('/api/session', (req, res) => {
  if(!req.query.filters) return res.json([]);

  let filters = [];
  try {
    filters = JSON.parse(req.query.filters);
  } catch(e) {
    console.error(e);
    return res.status(400).json('Could not parse request');
  };

  const where = _.chain(filters)
    .map(filter => {
      switch(filter.operator) {
        case 'equals':
          return mysql.escapeId(filter.column) + '=' + mysql.escape(filter.value);
        case 'contains':
          return mysql.escapeId(filter.column) + ' LIKE ' + mysql.escape(`%${filter.value}%`);
        case 'starts with':
          return mysql.escapeId(filter.column) + ' LIKE ' + mysql.escape(`${filter.value}%`);
        case 'in list':
          return mysql.escapeId(filter.column) + ' IN (' +  mysql.escape(filter.value) + ')';
        case 'between':
          if(!filter.betweenHigh) return;
          return mysql.escapeId(filter.column) + ' BETWEEN ' + mysql.escape(filter.value) + ' AND ' +  mysql.escape(filter.betweenHigh);
        case 'greater than':
          return mysql.escapeId(filter.column) + ' > ' + mysql.escape(filter.value);
        case 'less than':
          return mysql.escapeId(filter.column) + ' < ' + mysql.escape(filter.value);
      };
    })
    .compact()
    .join(' AND ')
    .value();

  if(!where) return res.json([]);

  pool.getConnection((err, connection) => {
    if(err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
    connection.query('SELECT * FROM `session` WHERE ' + where, (err, results, fields) => {
        connection.release();
        if(err) {
          console.error(err);
          return res.status(500).json({ error: 'Query Could Not Be Processed' });
        }
        res.json(results);
      });
  });
});

app.listen('3000');
