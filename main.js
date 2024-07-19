const { prepareI18N, loadI18NFile } = require("./js/logic/i18n.js");

const { BrowserWindow, app, ipcMain } = require("electron")
const path = require('node:path')
const fs = require('fs');
const { getSetting } = require("./js/logic/settingManager.js");

const GAME_NAME = "Cascy's Coding Adventure";
const filesRequireCaching = ['settings.json'];
const cachedFiles = new Map();
let win;

const showIntro = async () => {
    var fullscreenSetting = 1;
    if (cachedFiles.has('settings.json'))
        await cachedFiles.get('settings.json').then((file) => {
            fullscreenSetting = getSetting(file, 'performance.window_mode', 3);
        })
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
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: true
        },
        fullscreen: (fullscreenSetting === '2')
    });
    win.maximize();
    win.webContents.setWindowOpenHandler((edata) => {
        require("electron").shell.openExternal(edata.url);
        return { action: "deny" };
    });

    //win.loadFile("views/intro/logo.html"); DEACTIVATED FOR DEBUG ONLY
    win.loadFile("views/main_menu.html");

    ipcMain.on('toggle-fullscreen', (event, mode) => {
        win.setFullScreen(mode);
    });
    ipcMain.handle('information', (event) => {
        return {
            fullscreen: win.fullScreen,
        }
    });
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

async function preCacheFiles() {
    return new Promise((resolve, reject) => {
        filesRequireCaching.forEach(item => {
            let file = loadFile(null, item);
            if (!file) return;

            cachedFiles.set(item, file);
        });
        resolve();
    });
}

app.whenReady().then(async () => {
    await preCacheFiles().then(async () => {
        await showIntro();
        win.webContents.openDevTools();

        var languageSetting;
        await cachedFiles.get('settings.json').then((file) => {
            languageSetting = getSetting(file, 'general.language', 'en');
            loadI18NFile(languageSetting).then((languageFile) => {
                win.webContents.executeJavaScript(`localStorage.setItem('i18n', ${JSON.stringify(languageFile)})`);
            })
        });
    });
    ipcMain.on('leave-intro', leaveIntro);
    ipcMain.on('switch-page', switchPage);
    ipcMain.handle('request-asset', requestAsset);
    ipcMain.handle('load-file', loadFile);
    ipcMain.on('save-file', saveFile);
});

try {
    require('electron-reloader')(module)
} catch (_) { }

module.exports.cachedFiles = cachedFiles;