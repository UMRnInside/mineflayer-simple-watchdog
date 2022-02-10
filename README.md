# mineflayer-simple-watchdog
Simple watchdog for Mineflayer

## Installtion
`npm install https://github.com/UMRnInside/mineflayer-simple-watchdog`

## Example
Kick watchdog when someone chatted
```js
const mineflayer = require('mineflayer');
const simpleWatchdog = require('mineflayer-simple-watchdog');

if (process.argv.length < 4 || process.argv.length > 6) {
    console.log('Usage : node test.js <host> <port> [<name>] [<password>]')
    process.exit(1)
}

const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: process.argv[4] ? process.argv[4] : 'watchdog',
    password: process.argv[5],
    watchdogConfig: {
        // default: 30000
        timeout: 30000,
        // What to do if watchdog timed out? Reset!
        // default: bot.quit
        resetAction: onTimeout 
    }
});
bot.loadPlugin(simpleWatchdog);

bot.once('spawn', () => {
    // watchdog should be started manually
    bot.watchdog.start();
});

function onTimeout() {
    // watchdog stops once bot quits
    bot.chat("Oops! Watchdog timed out!");
    bot.quit();
}

bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    bot.watchdog.kick();
});
```
