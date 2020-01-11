const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const databaseCredentials = require('./env');

app.use(bodyParser.json())

const allowedOrigins = ['http://localhost:3000', 'https://ingavisinskaite.github.io'];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const port = 3001;
const coffeeTable = 'coffee_data';

app.options('*', cors(corsOptions))
app.get('/', (req, res) => {
    let con = mysql.createConnection(databaseCredentials);

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");
    });

})

app.get('/coffee', cors(corsOptions), (req, res) => {
    let con = mysql.createConnection(databaseCredentials);

    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        con.query(`SELECT * FROM ${coffeeTable}`, function (err, result, fields) {
            if (err) throw err;
            res.json(
                result
            );
        });

        con.end();
    });
})

app.post('/coffee', cors(corsOptions), (req, res) => {
    const url = req.body.url;
    const title = req.body.title;
    const price = req.body.price;

    let con = mysql.createConnection(databaseCredentials);

    let query = `INSERT INTO ${coffeeTable} (url, title, price) VALUES ('${url}', '${title}', '${price}');`;

    con.connect((error) => {
      console.log(error);
      con.query(query, (err, result) => {
        console.log(result);
        if (err) {
          res.json(false);
          throw err;
        }
        res.json(result.insertId)
      });
  
      con.end();
    });
})

app.get('/coffee/:id', cors(corsOptions), (req, res) => {
    const id = Number(req.params.id);

    let con = mysql.createConnection(databaseCredentials);

    const query = `SELECT * FROM ${coffeeTable} WHERE id = ` + id;

    con.connect((error) => {
        console.log(error);
        con.query(query, (err, result) => {
          if (err) {
            res.json(false);
            throw err;
          }
          res.json(result[0]);
        });
    
        con.end();
      })
})

app.put('/coffee/:id', cors(corsOptions), (req, res) => {
    const id = Number(req.params.id);
    const url = req.body.url;
    const title = req.body.title;
    const price = req.body.price;

    let con = mysql.createConnection(databaseCredentials);

    const query = `UPDATE ${coffeeTable} SET url=?, title=?, price=? WHERE id = ` + id;

    con.connect((error) => {
        console.log(error);
        con.query(query, [url, title, price], (err, result) => {
          if (err) {
            res.json(false);
            throw err;
          }
          console.log(result);
          res.json(result.insertId);
          console.log('Successfully edited');
        });
    
        con.end();
      })
})

app.delete('/coffee/:id', cors(corsOptions), (req, res) => {
    const id = Number(req.params.id);
    let con = mysql.createConnection(databaseCredentials);

    con.connect(function (err) {
        if (err) throw err;
        console.log('Connected!');
    
        con.query(`DELETE FROM ${coffeeTable} WHERE id = ` + id, function (err, result, fields) {
          if (err) {
            res.json(false);
            throw err;
          }
          res.json(true);
        });
    
        con.end();
      })
})


app.listen(process.env.PORT || port, () => {
    console.log('Started listening');
})