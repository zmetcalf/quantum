const express = require('express'),
      mysql   = require('mysql'),
      _       = require('lodash');

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

  connection.query(
    `SELECT * FROM `session` WHERE ${_.chain(req.params.filters)
      .map(filter.operator => {
          case 'equals':
            return '`' + connection.escape(filter.column) + '`="' + connection.escape(filter.value) + '"';
          case: 'contains':
            return '`' + connection.escape(filter.column) + '` LIKE "%' + connection.escape(filter.value) + '%"';
          case: 'starts with':
            return '`' + connection.escape(filter.column) + '` LIKE "' + connection.escape(filter.value) + '%"';
          case: 'in list':
            return '`' + connection.escape(filter.column) + '` IN (' +
              _.chain(filter.list)
                .map(item => connection.escape(item))
                .join(', ')
                .value()
            + ')';
          case: 'between':
            if(filter.list.length !== 2) return;
            return '`' + connection.escape(filter.column) + '` BETWEEN ' + connection.escape(filter.list[0]) + ' AND ' +  connection.escape(filter.list[1]);
          case 'greater than':
            return '`' + connection.escape(filter.column) + '` > ' + connection.escape(filter.value);
          case 'less than':
            return '`' + connection.escape(filter.column) + '` < ' + connection.escape(filter.value);
        }
      })
      .compact()
      .join(' AND ')
      .value()
    })}`, (err, results, fields) => {
      connection.end();
      if(err) return res.status(500).json({ error: 'Query Could Not Be Processed' });
      res.json(results);
    });
});

app.listen('3000');
