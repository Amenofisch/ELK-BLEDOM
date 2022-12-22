const config = require('../config/config.json');
var shell = require('shelljs');

const Spotify = require('./Spotify');
const Song = require('./song');
  
function d2h(d) {
    var s = (+d).toString(16);
    if(s.length < 2) {
        s = '0' + s;
    }
    return s;
}

// TODO: Replace gatttool with something more up to date.
// TODO: fix timezone

/** 
* @deprecated Do not use this function anymore, its broken!
* @param {string} resp Takes a string from a shell.exec and checks if it executed succesfully.
* Not the best solution but works well enough.
*/
async function handleResp(resp) {
    if(resp.toLowerCase().trim() !== "characteristic value was written successfully") {
        console.error("[" + new Date().toGMTString() +  "] " + resp);
        return false;
    }
    if(resp.toLowerCase().trim() === "connect to be:ff:20:00:06:ff: function not implemented (38)") {
        console.error("[" + new Date().toGMTString() +  "] " + resp);
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
    console.log("[" + new Date().toGMTString() + "]" + " Color set to " + hex);
    return true;
}

/**
 * 
 * @param {boolean} value Takes a boolean and toggles the led strip on/off
 */
async function setPower(value) {
    if(value) {
        let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e0404f00001ff00ef`);
    } else if (!value) {
        let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e0404000000ff00ef`)
    } else {
        console.error("Wrong request while trying to setPower. Value: " + value.toString());
        return false;
    }
    console.log("[" + new Date().toGMTString() + "]" + " Ledstrip power status changed to " + value.toString());
    return true;
}

/**
 * 
 * @param {integer} value Takes an integer between 0 and 100 to set the brightness of the led strip
 */
async function setBrightness(value) {
    if(value < 0 || value > 100) { console.error("Error setting brightness, value must be between 0 and 100"); return false;}

    let hex = d2h(value);
    let resp = await shell.exec(`gatttool -i ${config.device} -b ${config.bid} --char-write-req -a ${config.handle} -n 7e0401${hex}01ffff00ef`);
    console.log("[" + new Date().toGMTString() + "]" + " Brightness set to " + value + " HEX: " + hex);
    return true;
}

class DuocClass {
    constructor() {
        this.song = new Song()
        this.duoc = new Duoc(this)
        this.spotify = new Spotify(this)
        this.isPaused = true
        this.brightness = 100
    }

    start() {
        this.isPaused = false
        setPower = true
    }

    stop() {
        this.isPaused = true
        setPower = false
    }

    setSpotifyRefreshToken(token) {
        if(token == null) {
            this.spotify.stopPolling()
            this.spotify.refreshToken = null
            this.spotify.accessToken = {
                token: null,
                expiry: null
            }
            this.spotify.isReady = false;
            this.stop()
            this.emit('update')
        } else {
            this.spotify.refreshToken = token
            this.spotify.getAccessToken()
            this.spotify.isReady = true;
            this.spotify.startPolling()
            this.emit('update')
        }
    }
}

module.exports = { setColor, setPower, setBrightness, d2h };
