const express = require('express');
const app = express();
const config = require('./config/config.json');
const ledstrip = require('./modules/ledstrip.js');

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
app.use('/', ledrouter.router);

app.listen((config.port), () => {
    ledstrip.setBrightness(100); // Sets the brightness of the ledstrip to 100% so that the server counter is synced with the ledstrip
    console.log(`ELK-BLEDOM API v3 running on port ${config.port}`)
});