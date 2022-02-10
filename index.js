async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCurrentTimeMs() {
    return new Date().getTime();
}

function inject(bot, { watchdogConfig }) {
    let watchdog = {};

    watchdogConfig = watchdogConfig ?? {};
    watchdog.timeout = watchdogConfig.timeout ?? 30000;
    watchdog.checkInterval = watchdogConfig.checkInterval ?? 5000;
    watchdog.resetAction = watchdogConfig.resetAction ?? bot.quit;

    let running = false;
    let kickedSinceMs = 0;
    watchdog.start = async function() {
        if (running) return;
        kickedSinceMs = getCurrentTimeMs();
        running = true;
        while (running) {
            await sleep(watchdog.checkInterval);
            let currentTime = getCurrentTimeMs();
            if (currentTime - kickedSinceMs > watchdog.timeout) {
                running = false;
                watchdog.resetAction();
            }
        }
    };
    watchdog.kick = function() {
        kickedSinceMs = getCurrentTimeMs();
    };
    watchdog.stop = function() {
        running = false;
    };
    bot.watchdog = watchdog;
    bot.on("end", (_) => {
        watchdog.stop();
    });
}

module.exports = inject;
