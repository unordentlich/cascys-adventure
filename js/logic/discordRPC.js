const { Client } = require("discord-rpc-electron");
const { getSetting } = require("../../main.js");

const clientId = '1265011576977756191';
let rpc = new Client({ transport: 'ipc' });

console.log('getSetting', getSetting)

function loginDiscordRPC() {
    if(!getSetting('general.discord_rpc', false)) return;
    rpc.login({ clientId }).catch(console.error);
    return this;
}

async function setActivity(startTimestamp, text, sub) {
    if(!getSetting('general.discord_rpc', false)) return;
    if (!rpc) {
        return;
    }

    rpc.setActivity({
        details: text,
        state: sub,
        startTimestamp,
        largeImageKey: 'rpc-logo',
        instance: false,
        /**buttons: [
            {
                label: 'Get the game',
                url: 'https://github.com/unordentlich/cascys-adventure'
            }
        ]**/
    });
}

rpc.on('ready', () => {
    setActivity(Date.now(), "In Main Menu", "Browsing around...");
});

module.exports.loginDiscordRPC = loginDiscordRPC;
module.exports.updateDiscordRPC = setActivity;