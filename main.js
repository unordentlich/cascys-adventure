const { BrowserWindow, app } = require("electron")

const GAME_NAME = "Cascy's Coding Adventure"
let win;

const createWindow = () => {
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

    win.webContents.openDevTools();

    win.removeMenu();

    win.loadFile("views/main_menu.html")
    //attachTitlebarToWindow(win);
}

app.whenReady().then(() => {
    createWindow()
});

try {
    require('electron-reloader')(module)
  } catch (_) {}