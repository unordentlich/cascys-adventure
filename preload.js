const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  leaveIntro: () => ipcRenderer.send('leave-intro'),
  switchPage: (destination) => ipcRenderer.send('switch-page', destination),
  requestAsset: (path) => ipcRenderer.invoke('request-asset', path),
  loadFile: async (path) => ipcRenderer.invoke('load-file', path),
  loadPath: async (path) => ipcRenderer.invoke('load-path', path),
  saveFile: (path, file) => ipcRenderer.send('save-file', path, file),
  saveGlobalFile: (path, file) => ipcRenderer.send('save-global-file', path, file),
  toggleFullscreen: (mode) => ipcRenderer.send('toggle-fullscreen', mode),
  getInformation: () => ipcRenderer.invoke('information'),
  reloadI18n: () => ipcRenderer.send('reload-i18n'),
  requestLocationSave: async (content) => ipcRenderer.invoke('request-location-to-save', content),
  requestFile: async () => ipcRenderer.invoke('request-file'),
  loadGlobalFile: (path) => ipcRenderer.invoke('load-global-file', path),
  settingsLiveUpdate: (setting, newValue) => ipcRenderer.send('settings-live-update', setting, newValue),
  updateDiscordRPC: (data) => ipcRenderer.send('discord-rpc-update', data),
  retrieveLevelList: async (extended) => ipcRenderer.invoke('level-list', extended),
  startLevel: async (file) => ipcRenderer.invoke('level-start', file),
  openFolder: (path) => ipcRenderer.send('open-folder', path),
})