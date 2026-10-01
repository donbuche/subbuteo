import { app, BrowserWindow, dialog, ipcMain, net, powerSaveBlocker, protocol, shell } from 'electron'
import { randomUUID } from 'node:crypto'
import { copyFileSync, existsSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { getState, loadStore, mediaDir, setKey } from './store.js'

const SPLASH_DURATION = 2000
const isMac = process.platform === 'darwin'

// Protocolo media:// para servir escudos, sonidos y música importados por el usuario
protocol.registerSchemesAsPrivileged([
  { scheme: 'media', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
])

let mainWindow = null
let splashWindow = null
let awakeBlockerId = null

function rendererUrl(page) {
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    return { url: `${process.env.ELECTRON_RENDERER_URL}/${page}.html` }
  }
  return { file: join(__dirname, `../renderer/${page}.html`) }
}

function load(win, page) {
  const target = rendererUrl(page)
  return target.url ? win.loadURL(target.url) : win.loadFile(target.file)
}

function createSplash() {
  splashWindow = new BrowserWindow({
    width: 640,
    height: 400,
    frame: false,
    resizable: false,
    movable: false,
    show: false,
    center: true,
    backgroundColor: '#000000',
    webPreferences: { sandbox: true, contextIsolation: true }
  })
  load(splashWindow, 'splash')
  return new Promise((resolve) => splashWindow.once('ready-to-show', () => {
    splashWindow.show()
    resolve()
  }))
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    show: false,
    backgroundColor: '#0f6b34',
    title: 'Subbuteo Marcador',
    ...(isMac ? { titleBarStyle: 'hiddenInset' } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false,
      autoplayPolicy: 'no-user-gesture-required'
    }
  })

  const sendFullscreen = () => mainWindow.webContents.send('window:fullscreen', mainWindow.isFullScreen())
  mainWindow.on('enter-full-screen', sendFullscreen)
  mainWindow.on('leave-full-screen', sendFullscreen)

  // Los enlaces externos se abren en el navegador, nunca dentro de la app
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  load(mainWindow, 'index')
  return new Promise((resolve) => mainWindow.once('ready-to-show', resolve))
}

function registerMediaProtocol() {
  protocol.handle('media', (request) => {
    const name = basename(decodeURIComponent(new URL(request.url).pathname))
    const file = join(mediaDir(), name)
    if (!existsSync(file)) return new Response('Not found', { status: 404 })
    return net.fetch(pathToFileURL(file).toString())
  })
}

const MEDIA_FILTERS = {
  image: [{ name: 'Imágenes', extensions: ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'] }],
  audio: [{ name: 'Audio', extensions: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'] }]
}

function registerIpc() {
  ipcMain.handle('store:get', () => getState())
  ipcMain.handle('store:set', (_e, key, value) => setKey(key, value))

  ipcMain.handle('media:import', async (_e, { kind, multiple = false }) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: multiple ? ['openFile', 'multiSelections'] : ['openFile'],
      filters: MEDIA_FILTERS[kind] ?? []
    })
    if (result.canceled) return []
    return result.filePaths.map((source) => {
      const fileName = `${randomUUID()}${extname(source).toLowerCase()}`
      copyFileSync(source, join(mediaDir(), fileName))
      return { url: `media://local/${fileName}`, name: basename(source, extname(source)) }
    })
  })

  ipcMain.handle('media:remove', (_e, url) => {
    if (typeof url !== 'string' || !url.startsWith('media://')) return false
    const file = join(mediaDir(), basename(new URL(url).pathname))
    if (existsSync(file)) unlinkSync(file)
    return true
  })

  ipcMain.handle('file:save-text', async (_e, { defaultName, content, extension }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: defaultName,
      filters: [{ name: extension.toUpperCase(), extensions: [extension] }]
    })
    if (result.canceled || !result.filePath) return false
    writeFileSync(result.filePath, content, 'utf8')
    return true
  })

  ipcMain.handle('window:toggle-fullscreen', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen())
  })
  ipcMain.handle('window:is-fullscreen', () => mainWindow.isFullScreen())

  // Evita que la pantalla se apague durante un partido
  ipcMain.handle('power:keep-awake', (_e, enabled) => {
    if (enabled && awakeBlockerId === null) {
      awakeBlockerId = powerSaveBlocker.start('prevent-display-sleep')
    } else if (!enabled && awakeBlockerId !== null) {
      powerSaveBlocker.stop(awakeBlockerId)
      awakeBlockerId = null
    }
  })
}

app.whenReady().then(async () => {
  loadStore()
  registerMediaProtocol()
  registerIpc()

  await createSplash()
  const splashStart = Date.now()
  await createMainWindow()
  const remaining = Math.max(0, SPLASH_DURATION - (Date.now() - splashStart))

  setTimeout(() => {
    mainWindow.show()
    if (getState().settings.startFullscreen) mainWindow.setFullScreen(true)
    splashWindow?.close()
    splashWindow = null
  }, remaining)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow().then(() => mainWindow.show())
  })
})

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})
