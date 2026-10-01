import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getState: () => ipcRenderer.invoke('store:get'),
  set: (key, value) => ipcRenderer.invoke('store:set', key, value),
  importMedia: (kind, { multiple = false, label } = {}) => ipcRenderer.invoke('media:import', { kind, multiple, label }),
  removeMedia: (url) => ipcRenderer.invoke('media:remove', url),
  getDefaultTracks: () => ipcRenderer.invoke('music:defaults'),
  saveTextFile: (defaultName, content, extension) =>
    ipcRenderer.invoke('file:save-text', { defaultName, content, extension }),
  toggleFullscreen: () => ipcRenderer.invoke('window:toggle-fullscreen'),
  quit: () => ipcRenderer.invoke('app:quit'),
  isFullscreen: () => ipcRenderer.invoke('window:is-fullscreen'),
  onFullscreenChange: (callback) => ipcRenderer.on('window:fullscreen', (_e, value) => callback(value)),
  keepAwake: (enabled) => ipcRenderer.invoke('power:keep-awake', enabled),
  platform: process.platform
})
