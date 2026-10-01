// Motor de audio. Por defecto todo se sintetiza con Web Audio API (sin archivos
// ni licencias); si en Configuración se asigna un archivo, se usa ese archivo.
import { getSettings } from './state.js'

let ctx = null
let fxBus = null
let musicBus = null
let noiseBuffer = null

function audio() {
  if (!ctx) {
    ctx = new AudioContext()
    fxBus = ctx.createGain()
    musicBus = ctx.createGain()
    fxBus.connect(ctx.destination)
    musicBus.connect(ctx.destination)
    applyVolumes()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function noise() {
  if (!noiseBuffer) {
    const length = ctx.sampleRate * 2
    noiseBuffer = ctx.createBuffer(1, length, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  }
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  src.loop = true
  return src
}

const volumes = () => getSettings().volumes

export function applyVolumes() {
  const { effects, music } = volumes()
  if (fxBus) fxBus.gain.value = effects
  if (musicBus) musicBus.gain.value = music
  music_.syncVolume()
}

function playFile(url, volume) {
  const el = new Audio(url)
  el.volume = Math.min(1, volume)
  el.play().catch(() => {})
  return el
}

/* ---------- Silbato ---------- */

// Silbato "de bola": tono agudo con un trino rápido (FM + AM) y algo de soplido
function whistleBlast(t0, duration) {
  const out = ctx.createGain()
  out.gain.setValueAtTime(0, t0)
  out.gain.linearRampToValueAtTime(0.32, t0 + 0.02)
  out.gain.setValueAtTime(0.32, t0 + duration - 0.05)
  out.gain.linearRampToValueAtTime(0, t0 + duration)
  out.connect(fxBus)

  const tone = ctx.createOscillator()
  tone.frequency.value = 2750
  const trill = ctx.createOscillator()
  trill.frequency.value = 32
  const trillDepth = ctx.createGain()
  trillDepth.gain.value = 140
  trill.connect(trillDepth).connect(tone.frequency)

  const am = ctx.createGain()
  am.gain.value = 0.7
  const amDepth = ctx.createGain()
  amDepth.gain.value = 0.3
  trill.connect(amDepth).connect(am.gain)
  tone.connect(am).connect(out)

  const breath = noise()
  const band = ctx.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 2750
  band.Q.value = 6
  const breathGain = ctx.createGain()
  breathGain.gain.value = 0.25
  breath.connect(band).connect(breathGain).connect(out)

  for (const node of [tone, trill, breath]) {
    node.start(t0)
    node.stop(t0 + duration + 0.05)
  }
}

const WHISTLE_PATTERNS = {
  start: [0.55],
  pause: [0.16, 0.16],
  end: [0.4, 0.9],
  final: [0.35, 0.35, 1.25]
}

const WHISTLE_SETTING = { start: 'whistleStart', pause: 'whistlePause', end: 'whistleEnd', final: 'whistleEnd' }

export function playWhistle(type = 'start') {
  const custom = getSettings().sounds[WHISTLE_SETTING[type]]
  if (custom) return playFile(custom, volumes().effects)
  audio()
  let t = ctx.currentTime + 0.02
  for (const duration of WHISTLE_PATTERNS[type]) {
    whistleBlast(t, duration)
    t += duration + 0.12
  }
}

/* ---------- Grada ---------- */

function crowdCheer() {
  const t0 = ctx.currentTime + 0.02
  const length = 3.4

  // Rugido: ruido filtrado en dos bandas con una envolvente que crece y se apaga
  for (const [freq, q, level] of [[520, 0.8, 0.5], [1250, 1.2, 0.28]]) {
    const src = noise()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = q
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.0001, t0)
    gain.gain.exponentialRampToValueAtTime(level, t0 + 0.35)
    gain.gain.setValueAtTime(level, t0 + 1.6)
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + length)

    // Oscilación lenta para que suene a multitud y no a ruido plano
    const wobble = ctx.createOscillator()
    wobble.frequency.value = 2 + Math.random() * 3
    const wobbleDepth = ctx.createGain()
    wobbleDepth.gain.value = 0.3
    const mod = ctx.createGain()
    wobble.connect(wobbleDepth).connect(mod.gain)

    src.connect(filter).connect(mod).connect(gain).connect(fxBus)
    src.start(t0, Math.random())
    wobble.start(t0)
    src.stop(t0 + length)
    wobble.stop(t0 + length)
  }

  // Aplausos: ráfagas cortas de ruido agudo repartidas aleatoriamente
  for (let i = 0; i < 90; i++) {
    const t = t0 + 0.15 + Math.random() * (length - 0.9)
    const src = noise()
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1200 + Math.random() * 1800
    filter.Q.value = 1.4
    const gain = ctx.createGain()
    const level = 0.12 + Math.random() * 0.22
    gain.gain.setValueAtTime(level, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045)
    src.connect(filter).connect(gain).connect(fxBus)
    src.start(t, Math.random() * 1.5)
    src.stop(t + 0.05)
  }
}

export function playGoal() {
  music_.duck(3.5)
  const custom = getSettings().sounds.goal
  if (custom) return playFile(custom, volumes().effects)
  audio()
  crowdCheer()
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

export function previewSound(key) {
  if (key === 'goal') return playGoal()
  const type = { whistleStart: 'start', whistlePause: 'pause', whistleEnd: 'final' }[key]
  playWhistle(type)
}

/* ---------- Música de fondo ---------- */

// Tema sintetizado: aire de sintonía deportiva de los 70, en Do mayor, 8 compases en bucle
const TEMPO = 116
const EIGHTH = 60 / TEMPO / 2
const CHORDS = [
  { bass: 48, notes: [60, 64, 67] },
  { bass: 45, notes: [57, 60, 64] },
  { bass: 41, notes: [57, 60, 65] },
  { bass: 43, notes: [55, 59, 62] },
  { bass: 48, notes: [60, 64, 67] },
  { bass: 45, notes: [57, 60, 64] },
  { bass: 50, notes: [57, 62, 65] },
  { bass: 43, notes: [55, 59, 62] }
]
const MELODY = [
  [76, 79, 84, 79, 76, 79, 77, 76],
  [76, 72, 69, 72, 76, 77, 76, 74],
  [77, 81, 84, 81, 77, 76, 74, 72],
  [74, null, 79, null, 83, 81, 79, null],
  [76, 79, 84, 86, 84, 79, 76, 79],
  [81, 79, 76, 72, 76, 79, 81, null],
  [77, 81, 86, 81, 77, 76, 74, 77],
  [79, 77, 76, 74, 71, 74, 79, null]
]

const midiToHz = (m) => 440 * 2 ** ((m - 69) / 12)

function note(dest, { midi, t, duration, type = 'square', level = 0.1, cutoff = 2400 }) {
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.value = midiToHz(midi)
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = cutoff
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(level, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(filter).connect(gain).connect(dest)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

function hat(dest, t, level) {
  const src = noise()
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 7000
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(level, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04)
  src.connect(filter).connect(gain).connect(dest)
  src.start(t, Math.random())
  src.stop(t + 0.05)
}

class SynthTheme {
  constructor() {
    this.timer = null
    this.step = 0
    this.nextTime = 0
    this.out = null
  }

  start() {
    if (this.timer) return
    audio()
    this.out = ctx.createGain()
    this.out.gain.value = 0.0001
    this.out.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 1.5)
    this.out.connect(musicBus)
    this.nextTime = ctx.currentTime + 0.1
    this.timer = setInterval(() => this.schedule(), 25)
  }

  schedule() {
    while (this.nextTime < ctx.currentTime + 0.15) {
      const bar = Math.floor(this.step / 8) % 8
      const beat = this.step % 8
      const chord = CHORDS[bar]
      const t = this.nextTime

      // Bajo "oom-pah": fundamental y quinta en cada negra
      if (beat % 2 === 0) {
        const midi = beat % 4 === 0 ? chord.bass : chord.bass + 7
        note(this.out, { midi: midi - 12, t, duration: EIGHTH * 1.8, type: 'triangle', level: 0.32, cutoff: 900 })
      } else {
        // Acordes a contratiempo
        for (const n of chord.notes) note(this.out, { midi: n, t, duration: EIGHTH * 0.7, level: 0.035, cutoff: 1600 })
      }

      const melody = MELODY[bar][beat]
      if (melody) note(this.out, { midi: melody, t, duration: EIGHTH * 0.95, level: 0.06, cutoff: 3200 })
      hat(this.out, t, beat % 2 ? 0.03 : 0.015)

      this.step++
      this.nextTime += EIGHTH
    }
  }

  stop() {
    if (!this.timer) return
    clearInterval(this.timer)
    this.timer = null
    const out = this.out
    out.gain.setValueAtTime(out.gain.value, ctx.currentTime)
    out.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
    setTimeout(() => out.disconnect(), 800)
  }
}

class Playlist {
  constructor() {
    this.el = new Audio()
    this.index = -1
    this.el.addEventListener('ended', () => this.next())
    this.el.addEventListener('error', () => this.next())
    this.duckFactor = 1
  }

  get tracks() {
    return getSettings().music.tracks
  }

  start() {
    if (!this.tracks.length) return
    if (this.index === -1 || !this.el.src) return this.next()
    this.el.play().catch(() => {})
  }

  next() {
    const { tracks } = this
    if (!tracks.length) return this.stop()
    const shuffle = getSettings().music.shuffle && tracks.length > 1
    let index = (this.index + 1) % tracks.length
    if (shuffle) {
      do index = Math.floor(Math.random() * tracks.length)
      while (index === this.index)
    }
    this.index = index
    this.el.src = tracks[index].url
    this.syncVolume()
    this.el.play().catch(() => {})
  }

  stop() {
    this.el.pause()
  }

  reset() {
    this.stop()
    this.index = -1
    this.el.removeAttribute('src')
  }

  syncVolume() {
    this.el.volume = Math.min(1, volumes().music * this.duckFactor)
  }
}

// Fachada de la música: decide entre el tema sintetizado o la lista de reproducción
const music_ = {
  synth: new SynthTheme(),
  playlist: new Playlist(),
  playing: false,
  duckTimer: null,

  start() {
    if (getSettings().musicMuted) return
    this.playing = true
    if (getSettings().music.tracks.length) {
      this.synth.stop()
      this.playlist.start()
    } else {
      this.playlist.stop()
      this.synth.start()
    }
  },

  stop() {
    this.playing = false
    this.synth.stop()
    this.playlist.stop()
  },

  // Se llama cuando cambia la lista de temas en Configuración
  reload() {
    const wasPlaying = this.playing
    this.stop()
    this.playlist.reset()
    if (wasPlaying) this.start()
  },

  // Baja la música unos segundos para que se oiga bien la grada
  duck(seconds) {
    clearTimeout(this.duckTimer)
    this.setDuck(0.25)
    this.duckTimer = setTimeout(() => this.setDuck(1), seconds * 1000)
  },

  setDuck(factor) {
    this.playlist.duckFactor = factor
    this.playlist.syncVolume()
    if (musicBus) musicBus.gain.setTargetAtTime(volumes().music * factor, ctx.currentTime, 0.25)
  },

  syncVolume() {
    this.playlist.syncVolume()
  }
}

export const music = music_
