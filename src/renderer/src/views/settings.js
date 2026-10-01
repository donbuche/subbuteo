import { DEFAULT_SETTINGS, DEFAULT_TEAMS } from '@shared/defaults.js'
import { confirmDialog, toast } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { applyVolumes, music, previewSound } from '../core/audio.js'
import { animate, enter, stagger } from '../core/animate.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { getSettings, getTeams, saveTeams, updateSettings } from '../core/state.js'
import { crestUrl, esc, slugify, teamName } from '../core/utils.js'
import { LANGUAGES, setLanguage, t } from '../i18n/index.js'

const SECTIONS = ['teams', 'durations', 'sounds', 'music', 'general']
const SOUNDS = ['goal', 'whistleStart', 'whistlePause', 'whistleEnd']
const MAX_DURATION = 90

/* ---------- Plantillas de cada sección ---------- */

function teamsSection(draft) {
  const defaultCrest = (id) => DEFAULT_TEAMS.find((team) => team.id === id)?.crest
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.teams.available')}</h2>
      <ul class="team-list">
        ${getTeams().map((team) => `
          <li class="team-list__item" data-team="${esc(team.id)}">
            <img src="${esc(crestUrl(team))}" alt="" />
            <span class="team-list__name">${esc(teamName(team))}</span>
            <div class="team-list__actions">
              <button class="btn-icon btn-icon--sm" type="button" data-team-crest title="${t('settings.teams.changeCrest')}" aria-label="${t('settings.teams.changeCrest')}">${icons.upload}</button>
              ${team.builtin && team.crest !== defaultCrest(team.id) ? `<button class="btn-icon btn-icon--sm" type="button" data-team-restore title="${t('settings.teams.restoreCrest')}" aria-label="${t('settings.teams.restoreCrest')}">${icons.undo}</button>` : ''}
              ${team.builtin ? '' : `<button class="btn-icon btn-icon--sm" type="button" data-team-delete title="${t('settings.teams.delete')}" aria-label="${t('settings.teams.delete')}">${icons.trash}</button>`}
            </div>
          </li>`).join('')}
      </ul>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.teams.new')}</h2>
      <div class="new-team">
        <img class="new-team__crest" data-new-crest-preview src="${esc(crestUrl({ name: draft.name || '?', colors: draft.colors, crest: draft.crest }))}" alt="" />
        <div class="flex flex-col gap-4 flex-1">
          <label class="field">
            <span class="field__label">${t('settings.teams.name')}</span>
            <input class="input" data-new-team="name" maxlength="32" placeholder="${t('settings.teams.namePlaceholder')}" value="${esc(draft.name)}" />
          </label>
          <div class="flex gap-4 items-end flex-wrap">
            <label class="field">
              <span class="field__label">${t('settings.teams.color1')}</span>
              <input class="input input--color" type="color" data-new-team="color0" value="${draft.colors[0]}" />
            </label>
            <label class="field">
              <span class="field__label">${t('settings.teams.color2')}</span>
              <input class="input input--color" type="color" data-new-team="color1" value="${draft.colors[1]}" />
            </label>
            <button class="btn btn--secondary" type="button" data-new-team-crest>${icons.upload} ${draft.crest ? t('settings.teams.changeCrest') : t('settings.teams.uploadCrest')}</button>
            ${draft.crest ? `<button class="btn btn--outline-dark" type="button" data-new-team-crest-clear>${t('settings.teams.removeCrest')}</button>` : ''}
          </div>
          <p class="hint">${t('settings.teams.crestHint')}</p>
        </div>
        <button class="btn btn--lg self-end" type="button" data-new-team-add>${icons.plus} ${t('settings.teams.add')}</button>
      </div>
    </div>`
}

function durationsSection() {
  const { durations, defaultDuration } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.durations.presets')}</h2>
      <ul class="chips">
        ${durations.map((d) => `
          <li class="chip ${d === defaultDuration ? 'is-default' : ''}">
            <span>${t('common.min', { n: d })}</span>
            <button type="button" class="chip__remove" data-duration-remove="${d}" title="${t('settings.durations.remove')}" aria-label="${t('settings.durations.remove')}" ${durations.length === 1 ? 'disabled' : ''}>${icons.close}</button>
          </li>`).join('')}
      </ul>
      <div class="flex gap-4 items-end flex-wrap mt-6">
        <label class="field">
          <span class="field__label">${t('settings.durations.new')}</span>
          <input class="input w-40" type="number" min="1" max="${MAX_DURATION}" step="1" data-duration-input placeholder="${t('settings.durations.placeholder')}" />
        </label>
        <button class="btn" type="button" data-duration-add>${icons.plus} ${t('settings.durations.add')}</button>
      </div>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.durations.default')}</h2>
      <div class="flex gap-4 items-end flex-wrap">
        <label class="field">
          <span class="field__label">${t('settings.durations.onCreate')}</span>
          <select class="input w-56" data-duration-default>
            ${durations.map((d) => `<option value="${d}" ${d === defaultDuration ? 'selected' : ''}>${t('common.minutes', { n: d })}</option>`).join('')}
          </select>
        </label>
        <button class="btn btn--outline-dark" type="button" data-duration-reset>${icons.undo} ${t('settings.durations.reset')}</button>
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
      <h2 class="settings-block__title">${t('settings.sounds.volume')}</h2>
      ${slider('effects', volumes.effects)}
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.sounds.list')}</h2>
      <ul class="sound-list">
        ${SOUNDS.map((key) => `
          <li class="sound-list__item" data-sound="${key}">
            <div class="flex-1 min-w-0">
              <strong>${t(`settings.sounds.${key}`)}</strong>
              <span class="hint">${t(`settings.sounds.${key}Hint`)} · ${sounds[key] ? t('settings.sounds.custom') : t('settings.sounds.default')}</span>
            </div>
            <button class="btn-icon btn-icon--sm btn-icon--primary" type="button" data-sound-play title="${t('settings.sounds.play')}" aria-label="${t('settings.sounds.play')}">${icons.play}</button>
            <button class="btn-icon btn-icon--sm" type="button" data-sound-change title="${t('settings.sounds.choose')}" aria-label="${t('settings.sounds.choose')}">${icons.upload}</button>
            ${sounds[key] ? `<button class="btn-icon btn-icon--sm" type="button" data-sound-reset title="${t('settings.sounds.reset')}" aria-label="${t('settings.sounds.reset')}">${icons.undo}</button>` : ''}
          </li>`).join('')}
      </ul>
    </div>`
}

function musicSection() {
  const { music: cfg, volumes, musicMuted } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.music.volume')}</h2>
      ${slider('music', volumes.music)}
      <div class="flex flex-col gap-3 mt-6">
        ${toggle('musicMuted', t('settings.music.mute'), musicMuted)}
        ${cfg.tracks.length ? toggle('shuffle', t('settings.music.shuffle'), cfg.shuffle) : ''}
      </div>
    </div>
    ${cfg.tracks.length ? '' : defaultMusicBlock()}
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.music.playlist')}</h2>
      ${cfg.tracks.length
        ? `<ol class="track-list">
            ${cfg.tracks.map((track, i) => `
              <li class="track-list__item" data-track="${i}">
                <span class="track-list__index">${i + 1}</span>
                <span class="flex-1 truncate">${esc(track.name)}</span>
                <button class="btn-icon btn-icon--sm" type="button" data-track-move="-1" title="${t('settings.music.up')}" aria-label="${t('settings.music.up')}" ${i === 0 ? 'disabled' : ''}>${icons.up}</button>
                <button class="btn-icon btn-icon--sm" type="button" data-track-move="1" title="${t('settings.music.down')}" aria-label="${t('settings.music.down')}" ${i === cfg.tracks.length - 1 ? 'disabled' : ''}>${icons.down}</button>
                <button class="btn-icon btn-icon--sm" type="button" data-track-remove title="${t('settings.music.remove')}" aria-label="${t('settings.music.remove')}">${icons.trash}</button>
              </li>`).join('')}
          </ol>`
        : `<p class="hint">${t(music.defaults.length ? 'settings.music.customHint' : 'settings.music.empty')}</p>`}
      <div class="flex gap-4 flex-wrap mt-6">
        <button class="btn" type="button" data-track-add>${icons.plus} ${t('settings.music.add')}</button>
        ${cfg.tracks.length && music.defaults.length ? `<button class="btn btn--outline-dark" type="button" data-track-restore>${icons.undo} ${t('settings.music.restoreDefault')}</button>` : ''}
      </div>
    </div>`
}

// Hilo musical incluido en la app: solo lectura, se usa mientras no haya temas propios
function defaultMusicBlock() {
  if (!music.defaults.length) return ''
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.music.defaultTitle')}</h2>
      <p class="hint mb-4">${t('settings.music.defaultHint', { n: music.defaults.length })}</p>
      <ol class="track-list track-list--readonly">
        ${music.defaults.map((track, i) => `
          <li class="track-list__item">
            <span class="track-list__index">${i + 1}</span>
            <span class="flex-1 truncate">${esc(track.name)}</span>
          </li>`).join('')}
      </ol>
    </div>`
}

function generalSection() {
  const { startFullscreen, keepAwake, language } = getSettings()
  return `
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.general.language')}</h2>
      <label class="field">
        <span class="field__label">${t('settings.general.defaultLanguage')}</span>
        <select class="input w-72" data-default-language>
          ${LANGUAGES.map((l) => `<option value="${l.code}" ${l.code === language ? 'selected' : ''}>${l.name}</option>`).join('')}
        </select>
      </label>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.general.screen')}</h2>
      <div class="flex flex-col gap-3">
        ${toggle('startFullscreen', t('settings.general.fullscreen'), startFullscreen)}
        ${toggle('keepAwake', t('settings.general.keepAwake'), keepAwake)}
      </div>
    </div>
    <div class="settings-block">
      <h2 class="settings-block__title">${t('settings.general.shortcuts')}</h2>
      <dl class="shortcuts">
        <dt><kbd>Q</kbd> / <kbd>A</kbd></dt><dd>${t('settings.general.keysPlayer1')}</dd>
        <dt><kbd>P</kbd> / <kbd>L</kbd></dt><dd>${t('settings.general.keysPlayer2')}</dd>
        <dt><kbd>${t('settings.general.space')}</kbd></dt><dd>${t('settings.general.keysSpace')}</dd>
        <dt><kbd>⌃</kbd> <kbd>⌘</kbd> <kbd>F</kbd></dt><dd>${t('settings.general.keysFullscreen')}</dd>
      </dl>
    </div>`
}

const RENDERERS = { teams: teamsSection, durations: durationsSection, sounds: soundsSection, music: musicSection, general: generalSection }

/* ---------- Vista ---------- */

export function settingsView(container) {
  setBack(() => go('home'))
  let section = 'teams'
  let root = null
  let panel = null
  const draft = { name: '', colors: ['#e1261c', '#ffffff'], crest: null }

  function paint({ animated = false } = {}) {
    container.innerHTML = `
      <section class="settings">
        <h1 class="screen-title">${t('settings.title')}</h1>
        <div class="settings__layout">
          <nav class="settings__nav" role="tablist">
            ${SECTIONS.map((id) => `<button class="settings__nav-item" type="button" role="tab" data-section="${id}">${t(`settings.section.${id}`)}</button>`).join('')}
          </nav>
          <div class="panel settings__panel" data-panel></div>
        </div>
      </section>
    `
    root = container.firstElementChild
    panel = root.querySelector('[data-panel]')
    root.addEventListener('click', onClick)
    root.addEventListener('input', onInput)
    root.addEventListener('change', onChange)
    render()
    if (animated) {
      enter(root, [['.screen-title', 'fadeInDown', 0, 500], ['[data-panel]', 'fadeInUp', 150, 600]])
      stagger(root, '.settings__nav-item', 'fadeInLeft', { start: 100, step: 60, duration: 450 })
    }
  }

  function render() {
    root.querySelectorAll('[data-section]').forEach((b) => b.setAttribute('aria-selected', b.dataset.section === section))
    panel.innerHTML = RENDERERS[section](draft)
  }

  const importMedia = (kind, multiple = false) =>
    window.api.importMedia(kind, { multiple, label: t(kind === 'image' ? 'dialog.images' : 'dialog.audio') })

  /* --- Equipos --- */

  async function changeTeamCrest(id) {
    const [file] = await importMedia('image')
    if (!file) return
    await saveTeams(getTeams().map((team) => (team.id === id ? { ...team, crest: file.url } : team)))
    render()
  }

  async function restoreTeamCrest(id) {
    const original = DEFAULT_TEAMS.find((team) => team.id === id)
    await saveTeams(getTeams().map((team) => (team.id === id ? { ...team, crest: original.crest } : team)))
    render()
  }

  async function deleteTeam(id) {
    const team = getTeams().find((item) => item.id === id)
    if (!(await confirmDialog(t('settings.teams.deleteTitle'), t('settings.teams.deleteBody', { team: teamName(team) }), t('history.deleteConfirm')))) return
    await saveTeams(getTeams().filter((item) => item.id !== id))
    render()
  }

  async function addTeam() {
    const name = draft.name.trim()
    if (!name) return toast(t('settings.teams.nameRequired'))
    const teams = getTeams()
    if (teams.some((team) => [team.name, teamName(team)].some((n) => n.toLowerCase() === name.toLowerCase()))) return toast(t('settings.teams.duplicate'))
    let id = slugify(name) || 'equipo'
    while (teams.some((team) => team.id === id)) id += '-2'
    await saveTeams([...teams, { id, name, colors: [...draft.colors], crest: draft.crest, builtin: false }])
    Object.assign(draft, { name: '', crest: null })
    toast(t('settings.teams.added', { team: name }))
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
    const [file] = await importMedia('audio')
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

  async function onClick(e) {
    const el = (sel) => e.target.closest(sel)
    const teamId = el('[data-team]')?.dataset.team
    const soundKey = el('[data-sound]')?.dataset.sound
    const trackIndex = Number(el('[data-track]')?.dataset.track)
    const tracks = getSettings().music.tracks

    if (el('[data-section]')) {
      section = el('[data-section]').dataset.section
      render()
      return animate(panel, 'fadeIn', { duration: 300 })
    }

    if (el('[data-team-crest]')) return changeTeamCrest(teamId)
    if (el('[data-team-restore]')) return restoreTeamCrest(teamId)
    if (el('[data-team-delete]')) return deleteTeam(teamId)
    if (el('[data-new-team-add]')) return addTeam()
    if (el('[data-new-team-crest]')) {
      const [file] = await importMedia('image')
      if (file) draft.crest = file.url
      return render()
    }
    if (el('[data-new-team-crest-clear]')) {
      draft.crest = null
      return render()
    }

    if (el('[data-duration-remove]')) {
      const value = Number(el('[data-duration-remove]').dataset.durationRemove)
      return saveDurations(getSettings().durations.filter((d) => d !== value))
    }
    if (el('[data-duration-add]')) {
      const value = Number(panel.querySelector('[data-duration-input]').value)
      if (!Number.isInteger(value) || value < 1 || value > MAX_DURATION) return toast(t('settings.durations.invalid', { max: MAX_DURATION }))
      return saveDurations([...getSettings().durations, value])
    }
    if (el('[data-duration-reset]')) return saveDurations(DEFAULT_SETTINGS.durations, DEFAULT_SETTINGS.defaultDuration)

    if (el('[data-sound-play]')) return previewSound(soundKey)
    if (el('[data-sound-change]')) return changeSound(soundKey)
    if (el('[data-sound-reset]')) return resetSound(soundKey)

    if (el('[data-track-add]')) {
      const files = await importMedia('audio', true)
      if (files.length) return saveTracks([...tracks, ...files])
    }
    if (el('[data-track-move]')) {
      const to = trackIndex + Number(el('[data-track-move]').dataset.trackMove)
      const next = [...tracks]
      ;[next[trackIndex], next[to]] = [next[to], next[trackIndex]]
      return saveTracks(next)
    }
    if (el('[data-track-restore]')) {
      if (!(await confirmDialog(t('settings.music.restoreDefault'), t('settings.music.restoreBody'), t('settings.music.restoreConfirm')))) return
      tracks.forEach((track) => window.api.removeMedia(track.url))
      return saveTracks([])
    }
    if (el('[data-track-remove]')) {
      window.api.removeMedia(tracks[trackIndex].url)
      return saveTracks(tracks.filter((_, i) => i !== trackIndex))
    }
  }

  function onInput(e) {
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
  }

  async function onChange(e) {
    const { volume, toggle: key } = e.target.dataset
    if (volume) {
      await updateSettings({ volumes: { ...getSettings().volumes, [volume]: Number(e.target.value) } })
      if (volume === 'effects') previewSound('whistleStart')
    }
    if (e.target.matches('[data-duration-default]')) {
      await updateSettings({ defaultDuration: Number(e.target.value) })
      render()
    }
    if (e.target.matches('[data-default-language]')) {
      await updateSettings({ language: e.target.value })
      setLanguage(e.target.value)
    }
    if (key === 'shuffle') await updateSettings({ music: { ...getSettings().music, shuffle: e.target.checked } })
    if (key === 'startFullscreen' || key === 'keepAwake') await updateSettings({ [key]: e.target.checked })
    if (key === 'musicMuted') {
      await updateSettings({ musicMuted: e.target.checked })
      e.target.checked ? music.stop() : music.start()
    }
  }

  paint({ animated: true })
  return { relocalize: () => paint() }
}
