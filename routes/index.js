const express = require("express");
const router = express.Router();
const ledstrip = require("../modules/ledstrip.js");
const colors = require("../config/colors.json");

function returnHex(name) {
    let obj = colors.find((x) => x.colorname === name);
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
    if (!color) {
        res.send("Invalid request!").status(400);
        return;
    }
    if (!mode)
        mode = "default";

    try {
        ledstrip.setPower(true);
        let newColor = returnHex(color);

        if (mode == "default") {
            ledstrip.setColor(newColor);
        }

        if (mode == "custom") {
            ledstrip.setColor(color);
        }
        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/power", (req, res) => {
    if (req.body == null) {
        res.send("Invalid request! " + req.body).status(400);
        return;
    }

    try {
        let value = req.body.value;
        if (value)
            ledstrip.setPower(true);

        if (!value)
            ledstrip.setPower(false);
        res.status(200).send("Success!");
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/brightness", (req, res) => {
    if (req.body == null) {
        res.send("Invalid request").status(400);
        return;
    }

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
