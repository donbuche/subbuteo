// Motor de audio. El silbato y la grada son grabaciones incluidas en la app
// (ver CREDITS.md); si en Configuración se asigna un archivo, se usa ese.
// La música de fondo es la lista del usuario o, si está vacía, el hilo musical por defecto.
import clickSample from '../assets/sounds/button-press.mp3?inline'
import goalSample from '../assets/sounds/goal.m4a?inline'
import whistleSample from '../assets/sounds/whistle.m4a?inline'
import { getSettings } from './state.js'

let ctx = null
let fxBus = null
const buffers = new Map()

function audio() {
  if (!ctx) {
    ctx = new AudioContext()
    fxBus = ctx.createGain()
    fxBus.connect(ctx.destination)
    applyVolumes()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

// Las muestras van incrustadas como data: URI (base64); se decodifican sin fetch,
// que la CSP de la ventana no permite para data:
function loadSample(dataUri) {
  if (!buffers.has(dataUri)) {
    const bytes = Uint8Array.from(atob(dataUri.split(',')[1]), (c) => c.charCodeAt(0))
    buffers.set(dataUri, audio().decodeAudioData(bytes.buffer))
  }
  return buffers.get(dataUri)
}

const volumes = () => getSettings().volumes

export function applyVolumes() {
  if (fxBus) fxBus.gain.value = volumes().effects
  music.syncVolume()
}

function playFile(url) {
  const el = new Audio(url)
  el.volume = Math.min(1, volumes().effects)
  el.play().catch(() => {})
}

// Reproduce un trozo de la muestra con un fundido corto al final, para no cortar en seco
function playSegment(buffer, at, duration) {
  const length = Math.min(duration, buffer.duration)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(1, at)
  gain.gain.setValueAtTime(1, at + length - 0.05)
  gain.gain.linearRampToValueAtTime(0, at + length)
  src.connect(gain).connect(fxBus)
  src.start(at, 0, length)
}

/* ---------- Silbato ---------- */

// Duración de cada pitido (segundos); la grabación dura unos 0,8 s
const WHISTLE_PATTERNS = {
  start: [0.8],
  pause: [0.2, 0.2],
  end: [0.35, 0.8],
  final: [0.3, 0.3, 0.8]
}
const WHISTLE_SETTING = { start: 'whistleStart', pause: 'whistlePause', end: 'whistleEnd', final: 'whistleEnd' }

export async function playWhistle(type = 'start') {
  const custom = getSettings().sounds[WHISTLE_SETTING[type]]
  if (custom) return playFile(custom)
  const buffer = await loadSample(whistleSample)
  let at = ctx.currentTime + 0.02
  for (const duration of WHISTLE_PATTERNS[type]) {
    playSegment(buffer, at, duration)
    at += duration + 0.12
  }
}

/* ---------- Grada ---------- */

export async function playGoal() {
  music.duck(3) // la grada dura ~4,6 s: la música empieza a volver mientras se apaga
  const custom = getSettings().sounds.goal
  if (custom) return playFile(custom)
  const buffer = await loadSample(goalSample)
  playSegment(buffer, ctx.currentTime + 0.01, buffer.duration)
}

// Pequeño "toc" al restar un gol, para confirmar la pulsación
export function playTick() {
  audio()
  const t = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.frequency.setValueAtTime(420, t)
  osc.frequency.exponentialRampToValueAtTime(180, t + 0.12)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.25, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)
  osc.connect(gain).connect(fxBus)
  osc.start(t)
  osc.stop(t + 0.15)
}

/* ---------- Pulsaciones ---------- */

// Botones y demás elementos interactivos de toda la app. Los del marcador quedan
// fuera ([data-delta]): ya suenan con la grada o con playTick().
const CLICKABLE = 'button, a[href], select, [role="option"], .team-carousel__slide, .switch, input[type="color"]'
const CLICK_OFFSET = 0.045 // la grabación empieza con ~45 ms de silencio
let lastClick = 0

export async function playClick() {
  const buffer = await loadSample(clickSample)
  const src = ctx.createBufferSource()
  src.buffer = buffer
  src.connect(fxBus)
  src.start(ctx.currentTime, CLICK_OFFSET)
}

export function initClickSound() {
  document.addEventListener(
    'click',
    (e) => {
      const target = e.target.closest(CLICKABLE)
      if (!target || target.matches(':disabled, [data-delta]')) return
      // Un clic en una etiqueta genera otro en su control: que suene una sola vez
      if (e.timeStamp - lastClick < 80) return
      lastClick = e.timeStamp
      playClick()
    },
    true
  )
}

export function previewSound(key) {
  if (key === 'goal') return playGoal()
  playWhistle({ whistleStart: 'start', whistlePause: 'pause', whistleEnd: 'final' }[key])
}

// Precarga las muestras para que el primer gol (o clic) suene sin retraso
export function preloadSounds() {
  loadSample(whistleSample)
  loadSample(goalSample)
  loadSample(clickSample)
}

/* ---------- Música de fondo ---------- */

// Al marcar, la música baja al 60 % en 0,4 s y vuelve en 1,5 s mientras la grada se apaga
const DUCK_LEVEL = 0.6
const DUCK_FADE_IN = 400
const DUCK_FADE_OUT = 1500

export const music = {
  el: new Audio(),
  index: -1,
  duckFactor: 1,
  duckTimer: null,
  duckFrame: 0,
  playing: false,
  trackListeners: new Set(),

  defaults: [],

  get usingDefaults() {
    return getSettings().music.tracks.length === 0
  },

  get tracks() {
    return this.usingDefaults ? this.defaults : getSettings().music.tracks
  },

  get hasTracks() {
    return this.tracks.length > 0
  },

  async loadDefaults() {
    this.defaults = await window.api.getDefaultTracks()
  },

  init() {
    this.el.addEventListener('ended', () => this.next())
    this.el.addEventListener('error', () => this.tracks.length > 1 && this.next())
    // Empieza a sonar un tema nuevo o se reanuda tras silenciar la música
    this.el.addEventListener('playing', () => {
      const track = this.tracks[this.index]
      if (track) this.trackListeners.forEach((fn) => fn(track))
    })
  },

  onTrackStart(fn) {
    this.trackListeners.add(fn)
    return () => this.trackListeners.delete(fn)
  },

  start() {
    if (getSettings().musicMuted || !this.hasTracks) return
    this.playing = true
    if (this.index === -1 || !this.el.src) return this.next()
    this.el.play().catch(() => {})
  },

  stop() {
    this.playing = false
    this.el.pause()
  },

  next() {
    const { tracks } = this
    if (!tracks.length) return this.stop()
    let index = (this.index + 1) % tracks.length
    // El hilo musical por defecto siempre suena en orden aleatorio
    if ((this.usingDefaults || getSettings().music.shuffle) && tracks.length > 1) {
      do index = Math.floor(Math.random() * tracks.length)
      while (index === this.index)
    }
    this.index = index
    this.el.src = tracks[index].url
    this.syncVolume()
    this.el.play().catch(() => {})
  },

  // Se llama cuando cambia la lista de temas en Configuración
  reload() {
    const wasPlaying = this.playing
    this.stop()
    this.index = -1
    this.el.removeAttribute('src')
    if (wasPlaying || !getSettings().musicMuted) this.start()
  },

  // Baja un poco la música unos segundos para dar protagonismo a la grada,
  // con fundidos suaves para que ni la bajada ni la vuelta se noten
  duck(seconds) {
    clearTimeout(this.duckTimer)
    this.fadeDuck(DUCK_LEVEL, DUCK_FADE_IN)
    this.duckTimer = setTimeout(() => this.fadeDuck(1, DUCK_FADE_OUT), seconds * 1000)
  },

  fadeDuck(target, ms) {
    cancelAnimationFrame(this.duckFrame)
    const from = this.duckFactor
    const start = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - start) / ms)
      const eased = p * p * (3 - 2 * p) // smoothstep
      this.duckFactor = from + (target - from) * eased
      this.syncVolume()
      if (p < 1) this.duckFrame = requestAnimationFrame(step)
    }
    this.duckFrame = requestAnimationFrame(step)
  },

  syncVolume() {
    this.el.volume = Math.min(1, volumes().music * this.duckFactor)
  }
}

music.init()
