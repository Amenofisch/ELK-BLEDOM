const config = require('../config/config.json');
var shell = require('shelljs');

/** 
*
* @param {string} resp Takes a string from a shell.exec and checks if it executed succesfully.
*
*/
async function handleResp(resp) {
    if(resp.toLowerCase().trim() !== "characteristic value was written successfully") {
        console.error("[" + Date.now() +  " ERROR] " + resp);
        return false;
    }
    return true;
}

/**
 * 
 * @param {string} hex Takes a hexadecimal input (without #) and tries to set it as the color of the led strip
 */
async function setColor(hex) {
    let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e070503${hex}10ef`);
    if(!handleResp(resp)) setColor(hex);
    console.log("[" + Date.now() + "]" + " Color set to " + hex);
}

/**
 * 
 * @param {boolean} value Takes a boolean and toggles the led strip on/off
 */
async function setPower(value) {
    if(value) {
        let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e0404f00001ff00ef`);
        if(!handleResp(resp)) setPower(value);
    } else if (!value) {
        let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e0404000000ff00ef`)
        if(!handleResp(resp)) setPower(value);
    } else {
        console.error("Wrong request while trying to setPower. Value: " + value.toString());
        return;
    }
    console.log("[" + Date.now() + "]" + " Ledstrip power status changed to " + value.toString());
}

/**
 * 
 * @param {integer} value Takes an integer between 0 and 100 to set the brightness of the led strip
 */
async function setBrightness(value) {
    if(value < 0 || value > 100) { console.error("Error setting brightness, value must be between 0 and 100"); return;}

    let hex = value.toString(16);
    let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e0401${hex}01ffff00ef`);
    if(!handleResp(resp)) setBrightness(value);
    console.log("[" + Date.now() + "]" + " Brightness set to " + value + " HEX: " + hex);
}

module.exports = { setColor, setPower, setBrightness };