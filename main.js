const { BrowserWindow, app, ipcMain } = require("electron")
const path = require('node:path')

const GAME_NAME = "Cascy's Coding Adventure"
let win;

const showIntro = () => {
    win = new BrowserWindow({
        width: 800,
        height: 900,
        minHeight: 700,
        minWidth: 1200,
        icon: 'icon.png',
        title: GAME_NAME,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#000',
            symbolColor: '#fff',
            height: 32
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });

    win.loadFile("views/intro/logo.html");
}

function leaveIntro(event) {
    win.loadFile("views/main_menu.html");
    setTimeout(() => {
        win.setTitleBarOverlay({
            color: '#3e3b48',
            symbolColor: '#fff',
            height: 32
        });
    }, 2000)
}

const createMainWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 900,
        minHeight: 700,
        minWidth: 1200,
        icon: 'icon.png',
        title: GAME_NAME,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#3e3b48',
            symbolColor: '#fff',
            height: 32
        },
    });

    win.removeMenu();

    win.loadFile("views/main_menu.html")
}

app.whenReady().then(() => {
    showIntro();
    //win.webContents.openDevTools();
    ipcMain.on('leave-intro', leaveIntro);
});

try {
    require('electron-reloader')(module)
} catch (_) { }