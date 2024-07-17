const { BrowserWindow, app, ipcMain } = require("electron")
const path = require('node:path')
const fs = require('fs')

const GAME_NAME = "Cascy's Coding Adventure"
let win;

const showIntro = () => {
    win = new BrowserWindow({
        minHeight: 700,
        minWidth: 1200,
        icon: 'assets/characters/cascy/default.png',
        title: GAME_NAME,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: 'rgba(0,0,0,0)',
            symbolColor: '#fff',
            height: 32
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });
    win.maximize();

    win.loadFile("views/intro/logo.html");
}

function leaveIntro(event) {
    win.loadFile("views/main_menu.html");
    setTimeout(() => {
        win.setTitleBarOverlay({
            color: 'rgba(0,0,0,0)',
            symbolColor: '#fff',
            height: 32
        });
    }, 2000)
}

function switchPage(event, destination, titlebarColor) {
    if(titlebarColor) {
        win.setTitleBarOverlay({
            color: 'rgba(0,0,0,0)',
            symbolColor: '#fff',
            height: 32
        });
    }
    win.loadFile(destination);
}

function requestAsset(event, p) {
    const imagePath = path.join(__dirname, p);
    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');
    return `data:image/png;base64,${base64Image}`;
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
    win.webContents.openDevTools();
    ipcMain.on('leave-intro', leaveIntro);
    ipcMain.on('switch-page', switchPage);
    ipcMain.handle('request-asset', requestAsset);
});

try {
    require('electron-reloader')(module)
} catch (_) { }