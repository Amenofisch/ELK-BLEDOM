const express = require('express');
const app = express();
const config = require('./config/config.js');
const ledstrip = require('./modules/ledstrip.js');
const system = require('./routes/system.js');

const ledrouter = require('./routes/ledstrip.js');

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
app.use('/system', system.router);

app.listen((config.server.port), () => {
    ledstrip.setBrightness(100); // Sets the brightness of the ledstrip to 100%
    console.log(`ELK-BLEDOM API ${config.server.version} running on port ${config.server.port}`)
});