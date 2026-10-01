import { app } from 'electron'
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { DEFAULT_STATE, DEFAULT_SETTINGS, DEFAULT_TEAMS } from '@shared/defaults.js'

const STORE_KEYS = ['settings', 'teams', 'matches']

// Carpeta de datos fija, independiente del productName, y su nombre en versiones anteriores
export const DATA_FOLDER = 'Subbuteo Scoreboard'
const DATA_FILE = 'app-data.json'
const LEGACY = { folder: 'Subbuteo Marcador', file: 'subbuteo-data.json' }

// Llamar antes de app.whenReady(). Si se arranca con --user-data-dir (p. ej. en pruebas), se respeta.
export function configureDataDir() {
  if (app.commandLine.hasSwitch('user-data-dir')) return
  app.setPath('userData', join(app.getPath('appData'), DATA_FOLDER))
}

let state = null

export function dataDir() {
  return app.getPath('userData')
}

export function mediaDir() {
  const dir = join(dataDir(), 'media')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

function storeFile() {
  return join(dataDir(), DATA_FILE)
}

// Primera ejecución tras el cambio de ruta: copia los datos de la ubicación antigua.
// La carpeta antigua no se borra, por si hubiera que volver atrás.
function migrateLegacyData() {
  if (existsSync(storeFile())) return
  const legacyDir = join(app.getPath('appData'), LEGACY.folder)
  const legacyFile = join(legacyDir, LEGACY.file)
  if (!existsSync(legacyFile)) return
  mkdirSync(dataDir(), { recursive: true })
  copyFileSync(legacyFile, storeFile())
  const legacyMedia = join(legacyDir, 'media')
  if (existsSync(legacyMedia)) cpSync(legacyMedia, join(dataDir(), 'media'), { recursive: true, force: false })
}

// Combina lo guardado con los valores por defecto, para que las nuevas
// opciones de futuras versiones aparezcan sin perder los datos del usuario.
function migrate(saved) {
  const settings = {
    ...DEFAULT_SETTINGS,
    ...saved.settings,
    volumes: { ...DEFAULT_SETTINGS.volumes, ...saved.settings?.volumes },
    sounds: { ...DEFAULT_SETTINGS.sounds, ...saved.settings?.sounds },
    music: { ...DEFAULT_SETTINGS.music, ...saved.settings?.music }
  }

  const teams = Array.isArray(saved.teams) ? [...saved.teams] : []
  for (const builtin of DEFAULT_TEAMS) {
    if (!teams.some((t) => t.id === builtin.id)) teams.push(builtin)
  }

  return {
    version: DEFAULT_STATE.version,
    settings,
    teams,
    matches: Array.isArray(saved.matches) ? saved.matches : []
  }
}

export function loadStore() {
  migrateLegacyData()
  try {
    state = migrate(JSON.parse(readFileSync(storeFile(), 'utf8')))
  } catch {
    state = structuredClone(DEFAULT_STATE)
  }
  persist()
  return state
}

function persist() {
  // Escritura atómica: si la app se cierra a medias, el archivo no se corrompe
  const file = storeFile()
  const tmp = `${file}.tmp`
  writeFileSync(tmp, JSON.stringify(state, null, 2), 'utf8')
  renameSync(tmp, file)
}

export function getState() {
  return state
}

export function setKey(key, value) {
  if (!STORE_KEYS.includes(key)) throw new Error(`Clave no válida: ${key}`)
  state[key] = value
  persist()
  return state[key]
}
