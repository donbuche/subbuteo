import { DEFAULT_SETTINGS, DEFAULT_TEAMS } from '@shared/defaults.js'
import { confirmDialog, toast } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { applyVolumes, music, previewSound } from '../core/audio.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { getSettings, getTeams, saveTeams, updateSettings } from '../core/state.js'
import { crestUrl, esc, slugify } from '../core/utils.js'

const SECTIONS = [
  { id: 'teams', label: 'Equipos' },
  { id: 'durations', label: 'Duración' },
  { id: 'sounds', label: 'Sonidos' },
  { id: 'music', label: 'Música' },
  { id: 'general', label: 'General' }
]

const SOUNDS = [
  { key: 'goal', label: 'Gol', hint: 'Aplausos y griterío de la grada' },
  { key: 'whistleStart', label: 'Inicio / reanudación', hint: 'Silbato al empezar o reanudar una parte' },
  { key: 'whistlePause', label: 'Pausa', hint: 'Silbato al pausar el reloj' },
  { key: 'whistleEnd', label: 'Final de parte', hint: 'Silbato al acabar una parte o el partido' }
]

const MAX_DURATION = 90

/* ---------- Plantillas de cada sección ---------- */

function teamsSection(draft) {
  const teams = getTeams()
  const defaultCrest = (id) => DEFAULT_TEAMS.find((t) => t.id === id)?.crest
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">Equipos disponibles</h2>
      <ul class="team-list">
        ${teams.map((t) => `
          <li class="team-list__item" data-team="${esc(t.id)}">
            <img src="${esc(crestUrl(t))}" alt="" />
            <span class="team-list__name">${esc(t.name)}</span>
            <div class="team-list__actions">
              <button class="btn-icon btn-icon--sm" type="button" data-team-crest title="Cambiar escudo">${icons.upload}</button>
              ${t.builtin && t.crest !== defaultCrest(t.id) ? `<button class="btn-icon btn-icon--sm" type="button" data-team-restore title="Restaurar escudo original">${icons.undo}</button>` : ''}
              ${t.builtin ? '' : `<button class="btn-icon btn-icon--sm" type="button" data-team-delete title="Eliminar equipo">${icons.trash}</button>`}
            </div>
          </li>`).join('')}
      </ul>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">Añadir un nuevo equipo</h2>
      <div class="new-team">
        <img class="new-team__crest" data-new-crest-preview src="${esc(crestUrl({ name: draft.name || '?', colors: draft.colors, crest: draft.crest }))}" alt="" />
        <div class="flex flex-col gap-4 flex-1">
          <label class="field">
            <span class="field__label">Nombre</span>
            <input class="input" data-new-team="name" maxlength="32" placeholder="Ej.: Real Betis" value="${esc(draft.name)}" />
          </label>
          <div class="flex gap-4 items-end flex-wrap">
            <label class="field">
              <span class="field__label">Color 1</span>
              <input class="input input--color" type="color" data-new-team="color0" value="${draft.colors[0]}" />
            </label>
            <label class="field">
              <span class="field__label">Color 2</span>
              <input class="input input--color" type="color" data-new-team="color1" value="${draft.colors[1]}" />
            </label>
            <button class="btn" type="button" data-new-team-crest>${icons.upload} ${draft.crest ? 'Cambiar escudo' : 'Subir escudo'}</button>
            ${draft.crest ? `<button class="btn btn--ghost" type="button" data-new-team-crest-clear>Quitar escudo</button>` : ''}
          </div>
          <p class="hint">Si no subes un escudo, se generará uno con los colores del equipo.</p>
        </div>
        <button class="btn btn--lg self-end" type="button" data-new-team-add>${icons.plus} Añadir equipo</button>
      </div>
    </div>`
}

function durationsSection() {
  const { durations, defaultDuration } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">Duraciones predefinidas (minutos por parte)</h2>
      <ul class="chips">
        ${durations.map((d) => `
          <li class="chip ${d === defaultDuration ? 'is-default' : ''}">
            <span>${d} min</span>
            <button type="button" class="chip__remove" data-duration-remove="${d}" title="Quitar" ${durations.length === 1 ? 'disabled' : ''}>${icons.close}</button>
          </li>`).join('')}
      </ul>
      <div class="flex gap-4 items-end flex-wrap mt-6">
        <label class="field">
          <span class="field__label">Nueva duración</span>
          <input class="input w-40" type="number" min="1" max="${MAX_DURATION}" step="1" data-duration-input placeholder="Ej.: 12" />
        </label>
        <button class="btn" type="button" data-duration-add>${icons.plus} Añadir</button>
      </div>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">Duración por defecto</h2>
      <div class="flex gap-4 items-end flex-wrap">
        <label class="field">
          <span class="field__label">Al crear un partido</span>
          <select class="input w-56" data-duration-default>
            ${durations.map((d) => `<option value="${d}" ${d === defaultDuration ? 'selected' : ''}>${d} minutos</option>`).join('')}
          </select>
        </label>
        <button class="btn btn--ghost" type="button" data-duration-reset>Restaurar valores originales</button>
      </div>
    </div>`
}

const slider = (key, value) => `
  <label class="slider">
    ${icons.volume}
    <input type="range" min="0" max="1" step="0.05" value="${value}" data-volume="${key}" />
    <output>${Math.round(value * 100)}%</output>
  </label>`

const toggle = (key, label, checked) => `
  <label class="switch">
    <input type="checkbox" data-toggle="${key}" ${checked ? 'checked' : ''} />
    <span class="switch__track" aria-hidden="true"></span>
    <span>${label}</span>
  </label>`

function soundsSection() {
  const { sounds, volumes } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">Volumen de efectos</h2>
      ${slider('effects', volumes.effects)}
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">Sonidos del partido</h2>
      <ul class="sound-list">
        ${SOUNDS.map(({ key, label, hint }) => `
          <li class="sound-list__item" data-sound="${key}">
            <div class="flex-1 min-w-0">
              <strong>${label}</strong>
              <span class="hint">${hint} · ${sounds[key] ? 'Archivo personalizado' : 'Sonido por defecto'}</span>
            </div>
            <button class="btn-icon btn-icon--sm" type="button" data-sound-play title="Probar">${icons.play}</button>
            <button class="btn-icon btn-icon--sm" type="button" data-sound-change title="Elegir archivo">${icons.upload}</button>
            ${sounds[key] ? `<button class="btn-icon btn-icon--sm" type="button" data-sound-reset title="Volver al sonido por defecto">${icons.undo}</button>` : ''}
          </li>`).join('')}
      </ul>
    </div>`
}

function musicSection() {
  const { music: cfg, volumes, musicMuted } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">Volumen de la música</h2>
      ${slider('music', volumes.music)}
      <div class="flex flex-col gap-3 mt-6">
        ${toggle('musicMuted', 'Silenciar la música de fondo', musicMuted)}
        ${toggle('shuffle', 'Reproducción aleatoria', cfg.shuffle)}
      </div>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">Lista de reproducción</h2>
      ${cfg.tracks.length
        ? `<ol class="track-list">
            ${cfg.tracks.map((t, i) => `
              <li class="track-list__item" data-track="${i}">
                <span class="track-list__index">${i + 1}</span>
                <span class="flex-1 truncate">${esc(t.name)}</span>
                <button class="btn-icon btn-icon--sm" type="button" data-track-move="-1" title="Subir" ${i === 0 ? 'disabled' : ''}>${icons.up}</button>
                <button class="btn-icon btn-icon--sm" type="button" data-track-move="1" title="Bajar" ${i === cfg.tracks.length - 1 ? 'disabled' : ''}>${icons.down}</button>
                <button class="btn-icon btn-icon--sm" type="button" data-track-remove title="Quitar">${icons.trash}</button>
              </li>`).join('')}
          </ol>`
        : '<p class="hint">Sin temas propios: suena el tema sintetizado por defecto.</p>'}
      <div class="mt-6"><button class="btn" type="button" data-track-add>${icons.plus} Añadir temas (MP3, WAV, OGG, M4A…)</button></div>
    </div>`
}

function generalSection() {
  const { startFullscreen, keepAwake } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">Pantalla</h2>
      <div class="flex flex-col gap-3">
        ${toggle('startFullscreen', 'Abrir la app a pantalla completa', startFullscreen)}
        ${toggle('keepAwake', 'Evitar que la pantalla se apague durante un partido', keepAwake)}
      </div>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">Atajos de teclado en el partido</h2>
      <dl class="shortcuts">
        <dt><kbd>Q</kbd> / <kbd>A</kbd></dt><dd>Sumar / restar gol al jugador 1</dd>
        <dt><kbd>P</kbd> / <kbd>L</kbd></dt><dd>Sumar / restar gol al jugador 2</dd>
        <dt><kbd>Espacio</kbd></dt><dd>Iniciar, pausar o reanudar el reloj</dd>
        <dt><kbd>⌃</kbd> <kbd>⌘</kbd> <kbd>F</kbd></dt><dd>Pantalla completa (macOS)</dd>
      </dl>
    </div>`
}

const RENDERERS = { teams: teamsSection, durations: durationsSection, sounds: soundsSection, music: musicSection, general: generalSection }

/* ---------- Vista ---------- */

export function settingsView(container) {
  setBack(() => go('home'))
  let section = 'teams'
  const draft = { name: '', colors: ['#e1261c', '#ffffff'], crest: null }

  container.innerHTML = `
    <section class="settings">
      <h1 class="screen-title">Configuración</h1>
      <div class="settings__layout">
        <nav class="settings__nav" role="tablist">
          ${SECTIONS.map((s) => `<button class="tab" type="button" role="tab" data-section="${s.id}">${s.label}</button>`).join('')}
        </nav>
        <div class="panel settings__panel" data-panel></div>
      </div>
    </section>
  `
  const root = container.firstElementChild
  const panel = root.querySelector('[data-panel]')

  const render = () => {
    root.querySelectorAll('[data-section]').forEach((b) => b.setAttribute('aria-selected', b.dataset.section === section))
    panel.innerHTML = RENDERERS[section](draft)
  }

  /* --- Equipos --- */

  async function changeTeamCrest(id) {
    const [file] = await window.api.importMedia('image')
    if (!file) return
    await saveTeams(getTeams().map((t) => (t.id === id ? { ...t, crest: file.url } : t)))
    render()
  }

  async function restoreTeamCrest(id) {
    const original = DEFAULT_TEAMS.find((t) => t.id === id)
    await saveTeams(getTeams().map((t) => (t.id === id ? { ...t, crest: original.crest } : t)))
    render()
  }

  async function deleteTeam(id) {
    const team = getTeams().find((t) => t.id === id)
    if (!(await confirmDialog('Eliminar equipo', `${team.name} dejará de estar disponible. Los partidos del historial no cambian.`, 'Eliminar'))) return
    await saveTeams(getTeams().filter((t) => t.id !== id))
    render()
  }

  async function addTeam() {
    const name = draft.name.trim()
    if (!name) return toast('Escribe el nombre del equipo')
    const teams = getTeams()
    if (teams.some((t) => t.name.toLowerCase() === name.toLowerCase())) return toast('Ya existe un equipo con ese nombre')
    let id = slugify(name) || 'equipo'
    while (teams.some((t) => t.id === id)) id += '-2'
    await saveTeams([...teams, { id, name, colors: [...draft.colors], crest: draft.crest, builtin: false }])
    Object.assign(draft, { name: '', crest: null })
    toast(`${name} añadido`)
    render()
  }

  const updateDraftPreview = () => {
    panel.querySelector('[data-new-crest-preview]').src = crestUrl({ name: draft.name || '?', colors: draft.colors, crest: draft.crest })
  }

  /* --- Duraciones --- */

  async function saveDurations(durations, defaultDuration = getSettings().defaultDuration) {
    const sorted = [...new Set(durations)].sort((a, b) => a - b)
    await updateSettings({ durations: sorted, defaultDuration: sorted.includes(defaultDuration) ? defaultDuration : sorted[0] })
    render()
  }

  /* --- Sonidos y música --- */

  async function changeSound(key) {
    const [file] = await window.api.importMedia('audio')
    if (!file) return
    const previous = getSettings().sounds[key]
    await updateSettings({ sounds: { ...getSettings().sounds, [key]: file.url } })
    if (previous) window.api.removeMedia(previous)
    render()
  }

  async function resetSound(key) {
    const previous = getSettings().sounds[key]
    await updateSettings({ sounds: { ...getSettings().sounds, [key]: null } })
    if (previous) window.api.removeMedia(previous)
    render()
  }

  async function saveTracks(tracks) {
    await updateSettings({ music: { ...getSettings().music, tracks } })
    music.reload()
    render()
  }

  /* --- Eventos --- */

  root.addEventListener('click', async (e) => {
    const t = (sel) => e.target.closest(sel)
    const teamId = t('[data-team]')?.dataset.team
    const soundKey = t('[data-sound]')?.dataset.sound
    const trackIndex = Number(t('[data-track]')?.dataset.track)
    const tracks = getSettings().music.tracks

    if (t('[data-section]')) {
      section = t('[data-section]').dataset.section
      return render()
    }

    if (t('[data-team-crest]')) return changeTeamCrest(teamId)
    if (t('[data-team-restore]')) return restoreTeamCrest(teamId)
    if (t('[data-team-delete]')) return deleteTeam(teamId)
    if (t('[data-new-team-add]')) return addTeam()
    if (t('[data-new-team-crest]')) {
      const [file] = await window.api.importMedia('image')
      if (file) draft.crest = file.url
      return render()
    }
    if (t('[data-new-team-crest-clear]')) {
      draft.crest = null
      return render()
    }

    if (t('[data-duration-remove]')) {
      const value = Number(t('[data-duration-remove]').dataset.durationRemove)
      return saveDurations(getSettings().durations.filter((d) => d !== value))
    }
    if (t('[data-duration-add]')) {
      const value = Number(panel.querySelector('[data-duration-input]').value)
      if (!Number.isInteger(value) || value < 1 || value > MAX_DURATION) return toast(`Introduce un número entero entre 1 y ${MAX_DURATION}`)
      return saveDurations([...getSettings().durations, value])
    }
    if (t('[data-duration-reset]')) return saveDurations(DEFAULT_SETTINGS.durations, DEFAULT_SETTINGS.defaultDuration)

    if (t('[data-sound-play]')) return previewSound(soundKey)
    if (t('[data-sound-change]')) return changeSound(soundKey)
    if (t('[data-sound-reset]')) return resetSound(soundKey)

    if (t('[data-track-add]')) {
      const files = await window.api.importMedia('audio', true)
      if (files.length) return saveTracks([...tracks, ...files])
    }
    if (t('[data-track-move]')) {
      const to = trackIndex + Number(t('[data-track-move]').dataset.trackMove)
      const next = [...tracks]
      ;[next[trackIndex], next[to]] = [next[to], next[trackIndex]]
      return saveTracks(next)
    }
    if (t('[data-track-remove]')) {
      window.api.removeMedia(tracks[trackIndex].url)
      return saveTracks(tracks.filter((_, i) => i !== trackIndex))
    }
  })

  root.addEventListener('input', (e) => {
    const { newTeam, volume } = e.target.dataset
    if (newTeam === 'name') draft.name = e.target.value
    if (newTeam === 'color0') draft.colors[0] = e.target.value
    if (newTeam === 'color1') draft.colors[1] = e.target.value
    if (newTeam) return updateDraftPreview()

    if (volume) {
      // Se aplica al momento; se guarda al soltar (evento change)
      getSettings().volumes[volume] = Number(e.target.value)
      e.target.nextElementSibling.textContent = `${Math.round(e.target.value * 100)}%`
      applyVolumes()
    }
  })

  root.addEventListener('change', async (e) => {
    const { volume, toggle: key } = e.target.dataset
    if (volume) {
      await updateSettings({ volumes: { ...getSettings().volumes, [volume]: Number(e.target.value) } })
      if (volume === 'effects') previewSound('whistleStart')
    }
    if (e.target.matches('[data-duration-default]')) {
      await updateSettings({ defaultDuration: Number(e.target.value) })
      render()
    }
    if (key === 'shuffle') await updateSettings({ music: { ...getSettings().music, shuffle: e.target.checked } })
    if (key === 'startFullscreen' || key === 'keepAwake') await updateSettings({ [key]: e.target.checked })
    if (key === 'musicMuted') {
      await updateSettings({ musicMuted: e.target.checked })
      e.target.checked ? music.stop() : music.start()
    }
  })

  render()
}
