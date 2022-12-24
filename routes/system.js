const express = require("express");
const router = express.Router();
const config = require("../config/config.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    next();
});

// Returns a simple message
router.get("/config", (req, res) => {
    res.send({
        "server": config.server,
        "bluetooth": config.bluetooth,
    }).end();
});

module.exports = { router };