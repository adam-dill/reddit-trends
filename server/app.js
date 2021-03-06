const fs = require('fs');
const express = require('express');
const app = express();
const nocache = require('nocache');
var mysql = require('mysql');
const get = require('lodash/get');
const dbconfig = require('./dbconfig');
const port = 3000;

app.use(nocache());

app.get('/trends/all', (req, res) => {
    const sql = `SELECT * FROM trends`;
    query(sql, res);
});

app.get('/trends/dates', (req, res) => {
    const sql = `SELECT id, timestamp FROM trends`;
    query(sql, res);
});

app.get('/trends/id/:id', (req, res) => {
    const sql = `SELECT * FROM trends WHERE id='${req.params.id}'`;
    query(sql, res);
});

app.get('/trends/limit/:limit', (req, res) => {
    const limit = get(req.params, 'limit', `${Number.MAX_SAFE_INTEGER}`)
    const sql = `SELECT * FROM trends ORDER BY id DESC LIMIT ${limit}`;
    query(sql, res);
});


const query = (sql, res) => {
    var connection = mysql.createConnection(dbconfig);
    connection.connect()

    connection.query(sql, function (err, rows, fields) {
        if (err) {
            const date = new Date().toLocaleString();
            fs.appendFileSync('log.txt', `${date}\tERROR: ${err}\n`);
            throw err
        }
        res.json(rows);
    });

    connection.end()
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});