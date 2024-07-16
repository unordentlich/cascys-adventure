const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  leaveIntro: () => ipcRenderer.send('leave-intro'),
  switchPage: (destination, titlebarColor) => ipcRenderer.send('switch-page', destination, titlebarColor)
})