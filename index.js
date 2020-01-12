const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const localDbCredentials = require('./env');
const databaseCredentials = {
    host: process.env.host || localDbCredentials.host,
    port: process.env.dbPort || localDbCredentials.port,
    user: process.env.user || localDbCredentials.user,
    password: process.env.password || localDbCredentials.password,
    charset: process.env.charset || localDbCredentials.charset,
    database: process.env.database || localDbCredentials.database
}

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

const handleErrorIfNeeded = (err, response) => {
    if (err) {
        response.json(false);
        throw err;
    }
}

app.options('*', cors(corsOptions))
app.get('/', (req, res) => {
    let con = mysql.createConnection(databaseCredentials);

    con.connect(function (err) {
        handleErrorIfNeeded(err, res);
    });

})

app.get('/coffee', cors(corsOptions), (req, res) => {
    let con = mysql.createConnection(databaseCredentials);

    con.connect(function (error) {
        handleErrorIfNeeded(error, res);

        con.query(`SELECT * FROM ${coffeeTable}`, function (err, result, fields) {
            handleErrorIfNeeded(err, res);
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
        handleErrorIfNeeded(error, res);

        con.query(query, (err, result) => {
            handleErrorIfNeeded(err, res);
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
        handleErrorIfNeeded(error, res);

        con.query(query, (err, result) => {
            handleErrorIfNeeded(err, res);
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
        handleErrorIfNeeded(error, res);

        con.query(query, [url, title, price], (err, result) => {
            handleErrorIfNeeded(err, res);
            res.json(result.insertId);
        });

        con.end();
    })
})

app.delete('/coffee/:id', cors(corsOptions), (req, res) => {
    const id = Number(req.params.id);
    let con = mysql.createConnection(databaseCredentials);

    con.connect(function (error) {
        handleErrorIfNeeded(error, res);

        con.query(`DELETE FROM ${coffeeTable} WHERE id = ` + id, function (err, result, fields) {
            handleErrorIfNeeded(err, res);
            res.json(true);
        });

        con.end();
    })
})


app.listen(process.env.PORT || port, () => {
    console.log('Started listening');
})