const express = require('express');
const app = express();

const port = 5000;

const ledrouter = require('./routes/index.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

app.get('/favicon.ico', (req, res) => res.status(204).end());
app.use(ledrouter);

app.listen((port), () => {
    console.log(`ELK-BLEDOM API v3 running on port ${port}`)
});