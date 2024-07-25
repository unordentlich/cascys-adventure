const { Client } = require("discord-rpc-electron");
const { getSetting } = require("../../dataController");

const clientId = '1265011576977756191';
let rpc = new Client({ transport: 'ipc' });
let rpcToggled = false;
let timestamp;

async function loginDiscordRPC() {
    rpcToggled = await getSetting('general.discord_rpc', 0);
    console.log(rpcToggled);
    if (!rpcToggled) return;
    rpc.login({ clientId }).catch(console.error);
    return this;
}

async function disconnect() {
    rpc.clearActivity();
}

async function setActivity(data) {
    if (!rpcToggled) return;
    if (!rpc) {
        return;
    }
    if (data.startTimestamp) {
        timestamp = data.startTimestamp;
    }

    let activityJSON = {
        details: data.text,
        state: data.sub,
        startTimestamp: timestamp,
        largeImageKey: 'rpc-logo',
        instance: false,
        /**buttons: [
            {
                label: 'Get the game',
                url: 'https://github.com/unordentlich/cascys-adventure'
            }
        ]**/
    };

    if(data.largeImageText) {
        activityJSON.largeImageText = data.largeImageText;
    }

    if(data.smallImageKey) {
        activityJSON.smallImageKey = data.smallImageKey;
    }
    
    if(data.smallImageKey && data.smallImageText) {
        activityJSON.smallImageText = data.smallImageText;
    }

    rpc.setActivity(activityJSON);
}

rpc.on('ready', () => {
    setActivity({
        text: 'In Main Menu',
        sub: 'Browsing around...',
        startTimestamp: Date.now()
    });
});

module.exports.loginDiscordRPC = loginDiscordRPC;
module.exports.updateDiscordRPC = setActivity;
module.exports.disconnect = disconnect;