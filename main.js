const { BrowserWindow, app, ipcMain } = require("electron")
const path = require('node:path')
const fs = require('fs')

const GAME_NAME = "Cascy's Coding Adventure";
const filesRequireCaching = ['settings.json'];
const cachedFiles = new Map();
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
    win.webContents.setWindowOpenHandler((edata) => {
        require("electron").shell.openExternal(edata.url);
        return { action: "deny" };
    });

    //win.loadFile("views/intro/logo.html"); DEACTIVATED FOR DEBUG ONLY
    win.loadFile("views/main_menu.html");
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

function switchPage(event, destination) {
    win.loadFile(destination);
}

function requestAsset(event, p) {
    const imagePath = path.join(__dirname, p);
    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');
    return `data:image/png;base64,${base64Image}`;
}

async function loadFile(event, p) {
    if (cachedFiles.has(p)) return cachedFiles.get(p);
    const filePath = path.join(app.getPath('userData'), p);
    let file = await fs.promises.readFile(filePath, 'utf-8');
    return file;
}

function saveFile(event, p, file) {
    if (cachedFiles.has(p)) cachedFiles.set(p, file);
    const filePath = path.join(app.getPath('userData'), p);
    fs.writeFileSync(filePath, file);
}

function preCacheFiles() {
    filesRequireCaching.forEach(item => {
        let file = loadFile(null, item);
        if (!file) return;

        cachedFiles.set(item, file);
    });
}

app.whenReady().then(() => {
    showIntro();
    preCacheFiles();
    win.webContents.openDevTools();
    ipcMain.on('leave-intro', leaveIntro);
    ipcMain.on('switch-page', switchPage);
    ipcMain.handle('request-asset', requestAsset);
    ipcMain.handle('load-file', loadFile);
    ipcMain.on('save-file', saveFile);
});

try {
    require('electron-reloader')(module)
} catch (_) { }