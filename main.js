const { loadI18NFile } = require("./js/logic/i18n.js");

const { BrowserWindow, app, ipcMain, dialog } = require("electron")
const path = require('node:path')
const fs = require('fs');
const { loginDiscordRPC, updateDiscordRPC } = require("./js/logic/discordRPC.js");
const { getSetting, loadFile, preCacheFiles, saveFile } = require("./dataController.js");

const GAME_NAME = "Cascy's Coding Adventure";

let discordRPC;
let win;

const showIntro = async () => {
    var fullscreenSetting = 1;
    fullscreenSetting = await getSetting('performance.window_mode', 3);

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
    ipcMain.on('reload-i18n', async (event) => {
        var languageSetting = await getSetting('general.language', 'en');
        loadI18NFile(languageSetting).then((languageFile) => {
            win.webContents.executeJavaScript(`localStorage.setItem('i18n', ${JSON.stringify(languageFile)}); window.dispatchEvent(new StorageEvent('storage', { key: 'i18n' }));`);
        });
    });
    ipcMain.handle('information', (event) => {
        return {
            version: app.getVersion(),
            fullscreen: win.fullScreen,
        }
    });
}

function switchPage(event, destination) {
    win.loadFile(destination);

    if (destination === 'views/level_editor.html') {
        updateDiscordRPC(Date.now(), 'Level Creator', 'Working on new CSS lessons...')
    }
}

function requestAsset(event, p) {
    const imagePath = path.join(__dirname, p);
    const image = fs.readFileSync(imagePath);
    const base64Image = image.toString('base64');
    return `data:image/png;base64,${base64Image}`;
}

function saveGlobalFile(event, p, file) {
    fs.writeFileSync(p, file, { flag: 'wx' });
}

app.whenReady().then(async () => {
    await preCacheFiles();
    await showIntro();
    win.webContents.openDevTools();

    setTimeout(() => {
        discordRPC = loginDiscordRPC();
    }, 2000);

    var languageSetting = await getSetting('general.language', 'en');
    loadI18NFile(languageSetting).then((languageFile) => {
        win.webContents.executeJavaScript(`localStorage.setItem('i18n', ${JSON.stringify(languageFile)})`);
    });

    ipcMain.on('switch-page', switchPage);
    ipcMain.handle('request-asset', requestAsset);
    ipcMain.handle('load-file', loadFile);
    ipcMain.on('save-file', saveFile);
    ipcMain.on('save-global-file', saveGlobalFile);

    ipcMain.handle('request-path', async (event) => {
        var path = await dialog.showOpenDialog({
            defaultPath: app.getPath('userData'),
            properties: ['openDirectory']
        });
        return path.filePaths;
    });

    ipcMain.handle('request-file', async (event) => {
        var path = await dialog.showOpenDialog({
            defaultPath: app.getPath('userData'),
            filters: [
                { name: "JSON File", extensions: ["json"] },
                { name: "All Files", extensions: ["*"] }
            ],
            properties: ['openFile']
        });

        var file = await loadFile(null, path.filePaths[0], true);
        return {
            path: path.filePaths[0],
            content: file
        };
    });
});

try {
    require('electron-reloader')(module)
} catch (_) { }
