# ELK-BLEDOM [![Deploy Production to PI](https://github.com/Amenofisch/ELK-BLEDOM/actions/workflows/production.yml/badge.svg)](https://github.com/Amenofisch/ELK-BLEDOM/actions/workflows/production.yml)
Control your chinese LED Controller with simple POST requests and Bluetooth Low-Energy (BLE)

## Turning on LEDs
Send post request to "http://yourip:5000/power" with the following request body: `{"value": true}`
## Turning off LEDS
Send post request to "http://yourip:5000/power" with the following request body: `{"value": false}`
## Changing color of LEDs
Send post request to "http://yourip:5000/color" with the following request body: 
`{ "color": "any colorname from colors.json" }` 

or alternatively you can specify a custom hex code with the following request body: 
`{ "color": "FF00FF", "mode": "custom" }`

## Changing brightness of LEDs
Send post request to "http://yourip:5000/brightness" with the following request body:
`{ "value": 100 }`

You can choose any number between 0 and 100.




# Setup
## Configuration
You can set the Bluetooth Address in "config/config.json" under "bid".
You can also set which handle it should write to in "config"/config.sjon" under "handle"
You can also specify an alternative device that it should use to communicate with, in "config/config.json" under "device"

## Requirements

 - Raspberry Pi with Bluetooth capability (with any linux os installed)
 - gatttool `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev` (not tested)
 - some coding knowledge
- shelljs
- expressjs 
- nodejs   ( [w3schools tutorial for installation](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp) )
- ( recommended ) pm2 `npm install -g pm2`

## Installation

 1. Edit the config files to your needs
 2. Install the needed packages
 3. Run using `pm2 start index.js`
 4. Enjoy.
