import { app, BrowserWindow, dialog, ipcMain, powerSaveBlocker, protocol, shell } from 'electron'
import { randomUUID } from 'node:crypto'
import { closeSync, copyFileSync, existsSync, openSync, readdirSync, readFileSync, readSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { configureDataDir, getState, loadStore, mediaDir, setKey } from './store.js'

const isMac = process.platform === 'darwin'

configureDataDir()

// Protocolo media:// para servir escudos, sonidos y música importados por el usuario
protocol.registerSchemesAsPrivileged([
  { scheme: 'media', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }
])

let mainWindow = null
let awakeBlockerId = null

function load(win, page) {
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) return win.loadURL(`${process.env.ELECTRON_RENDERER_URL}/${page}.html`)
  return win.loadFile(join(__dirname, `../renderer/${page}.html`))
}

// En desarrollo, Electron muestra su propio icono: usamos el de la app (empaquetada ya lo lleva)
const devIcon = () => join(app.getAppPath(), 'build/icon.png')

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    show: false,
    // Se crea directamente a pantalla completa y en negro: el splash se pinta dentro
    // de esta misma ventana, así no hay salto de tamaño entre splash y app
    fullscreen: getState().settings.startFullscreen,
    fullscreenable: true,
    backgroundColor: '#0b1222',
    title: 'Subbuteo Scoreboard',
    ...(!app.isPackaged && !isMac ? { icon: devIcon() } : {}),
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
    if (url.startsWith('https://')) shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    if (getState().settings.startFullscreen && !mainWindow.isFullScreen()) mainWindow.setFullScreen(true)
  })
  load(mainWindow, 'index')
}

// Hilo musical por defecto: los MP3 de src/renderer/public/music (en producción, copiados a out/renderer/music)
function defaultMusicDir() {
  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) return join(app.getAppPath(), 'src/renderer/public/music')
  return join(__dirname, '../renderer/music')
}

// Nombre de Pixabay "autor-01-titulo-del-tema-123456.mp3" -> "Titulo Del Tema · autor"
function trackTitle(fileName) {
  const parts = basename(fileName, extname(fileName)).split(/[-_]+/).filter(Boolean)
  if (parts.length > 1 && /^\d{5,}$/.test(parts.at(-1))) parts.pop()
  if (parts.length < 2) return parts.join(' ')
  const author = parts.shift()
  while (parts.length > 1 && /^\d{1,2}$/.test(parts[0])) parts.shift()
  const title = parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  return `${title} · ${author}`
}

function registerMediaProtocol() {
  // media://local/<archivo> = importado por el usuario; media://bundled/<archivo> = hilo musical por defecto
  protocol.handle('media', (request) => {
    const url = new URL(request.url)
    const name = basename(decodeURIComponent(url.pathname))
    const file = join(url.hostname === 'bundled' ? defaultMusicDir() : mediaDir(), name)
    if (!existsSync(file)) return new Response('Not found', { status: 404 })
    return fileResponse(file, request.headers.get('range'))
  })
}

const MIME_TYPES = {
  mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', ogg: 'audio/ogg', wav: 'audio/wav', flac: 'audio/flac',
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', webp: 'image/webp', gif: 'image/gif'
}

// Respuesta con tamaño y soporte de rangos, para que el audio tenga duración y se pueda buscar
function fileResponse(file, range) {
  const size = statSync(file).size
  const headers = { 'Content-Type': MIME_TYPES[extname(file).slice(1).toLowerCase()] ?? 'application/octet-stream', 'Accept-Ranges': 'bytes' }
  const match = /bytes=(\d*)-(\d*)/.exec(range ?? '')
  if (!match) return new Response(readFileSync(file), { headers: { ...headers, 'Content-Length': String(size) } })

  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]))
  const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
  const body = Buffer.alloc(Math.max(0, end - start + 1))
  const fd = openSync(file, 'r')
  readSync(fd, body, 0, body.length, start)
  closeSync(fd)
  return new Response(body, {
    status: 206,
    headers: { ...headers, 'Content-Length': String(body.length), 'Content-Range': `bytes ${start}-${end}/${size}` }
  })
}

const MEDIA_EXTENSIONS = {
  image: ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'],
  audio: ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac']
}

function registerIpc() {
  ipcMain.handle('store:get', () => getState())
  ipcMain.handle('store:set', (_e, key, value) => setKey(key, value))

  ipcMain.handle('media:import', async (_e, { kind, multiple = false, label }) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: multiple ? ['openFile', 'multiSelections'] : ['openFile'],
      filters: [{ name: label || kind, extensions: MEDIA_EXTENSIONS[kind] ?? [] }]
    })
    if (result.canceled) return []
    return result.filePaths.map((source) => {
      const fileName = `${randomUUID()}${extname(source).toLowerCase()}`
      copyFileSync(source, join(mediaDir(), fileName))
      return { url: `media://local/${fileName}`, name: basename(source, extname(source)) }
    })
  })

  ipcMain.handle('music:defaults', () => {
    const dir = defaultMusicDir()
    if (!existsSync(dir)) return []
    return readdirSync(dir)
      .filter((f) => MEDIA_EXTENSIONS.audio.includes(extname(f).slice(1).toLowerCase()))
      .sort()
      .map((f) => ({ url: `media://bundled/${encodeURIComponent(f)}`, name: trackTitle(f) }))
  })

  ipcMain.handle('media:remove', (_e, url) => {
    if (typeof url !== 'string' || !url.startsWith('media://local/')) return false
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

  ipcMain.handle('app:quit', () => app.quit())

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
  if (isMac && !app.isPackaged && existsSync(devIcon())) app.dock.setIcon(devIcon())
  loadStore()
  registerMediaProtocol()
  registerIpc()

  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (!isMac) app.quit()
})
