const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  leaveIntro: () => ipcRenderer.send('leave-intro'),
  switchPage: (destination) => ipcRenderer.send('switch-page', destination),
  requestAsset: (path) => ipcRenderer.invoke('request-asset', path),
  loadFile: (path) => ipcRenderer.invoke('load-file', path),
  saveFile: (path, file) => ipcRenderer.send('save-file', path, file),
  toggleFullscreen: (mode) => ipcRenderer.send('toggle-fullscreen', mode),
  getInformation: () => ipcRenderer.invoke('information'),
})