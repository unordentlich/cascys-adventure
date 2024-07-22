const { Client } = require("discord-rpc-electron");
const { getSetting } = require("./settingManager");

const clientId = '1265011576977756191';
let rpc = new Client({ transport: 'ipc' });

function loginDiscordRPC() {
    rpc.login({ clientId }).catch(console.error);
    return this;
}

async function setActivity(startTimestamp, text, sub) {
    if (!rpc) {
        return;
    }

    rpc.setActivity({
        details: text,
        state: sub,
        startTimestamp,
        instance: false,
        buttons: [
            {
                label: 'Download',
                url: 'https://github.com/unordentlich/cascys-adventure'
            }
        ]
    });
}

rpc.on('ready', () => {
    setActivity(Date.now(), "In Main Menu", "Browsing around...");
});

module.exports.loginDiscordRPC = loginDiscordRPC;
module.exports.updateDiscordRPC = setActivity;