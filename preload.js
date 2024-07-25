const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  leaveIntro: () => ipcRenderer.send('leave-intro'),
  switchPage: (destination) => ipcRenderer.send('switch-page', destination),
  requestAsset: (path) => ipcRenderer.invoke('request-asset', path),
  loadFile: (path) => ipcRenderer.invoke('load-file', path),
  saveFile: (path, file) => ipcRenderer.send('save-file', path, file),
  saveGlobalFile: (path, file) => ipcRenderer.send('save-global-file', path, file),
  toggleFullscreen: (mode) => ipcRenderer.send('toggle-fullscreen', mode),
  getInformation: () => ipcRenderer.invoke('information'),
  reloadI18n: () => ipcRenderer.send('reload-i18n'),
  requestPath: async () => ipcRenderer.invoke('request-path'),
  requestFile: async () => ipcRenderer.invoke('request-file'),
  loadGlobalFile: (path) => ipcRenderer.invoke('load-global-file', path)
})