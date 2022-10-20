const express = require("express");
const router = express.Router();
const ledstrip = require("../modules/ledstrip.js");
const colors = require("../config/colors.json");
const path = require('path');
const { i18n } = require('../modules/i18n.js');

/**
 * 
 * @param {String} name Takes a color name from colors.json (default is german)
 * @returns {String} Returns a HEX value of that color without the # in the beginning 
 */


function returnHex(name) {
    let obj = colors.find((x) => x.colorname === i18n.__(name));
    let color = obj.colorhex.replace('#', '');
    return color;
}

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    next();
});

router.get("/", (req, res) => {
    res.send("Bluetooth API v3 for ELK-BLEDOM LED Strip Controller").end();
});

router.post("/color", (req, res) => {
    let color = req.body.color;
    let mode = req.body.mode;
    let lang = req.body.lang;

    if (!color) { res.send("Invalid request!").status(400); return; }
    if (!mode) mode = "default";
    if(!lang) lang = 'de';

    try {
        ledstrip.setPower(true);    // Ensures that the Ledstrip is turned on before trying to change color

        if (mode == "default") {
            let hexColor = returnHex(color);
            ledstrip.setColor(hexColor);
        }

        if (mode == "custom") ledstrip.setColor(color); 

        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/power", (req, res) => {
    if (req.body == null) { res.send("Invalid request! " + req.body).status(400); return; }

    try {
        let value = req.body.value;
        if (value) ledstrip.setPower(true);
        if (!value) ledstrip.setPower(false);

        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/brightness", (req, res) => {
    if (req.body == null) { res.send("Invalid request").status(400); return; }

    try {
        let value = req.body.value;
        
        ledstrip.setBrightness(value);
        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
