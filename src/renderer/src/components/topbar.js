import { music } from '../core/audio.js'
import { icons } from '../core/icons.js'
import { getSettings, onStateChange, updateSettings } from '../core/state.js'
import { onLanguageChange, t } from '../i18n/index.js'
import { createLanguageMenu } from './language-menu.js'
import { toast } from './modal.js'

let backHandler = null

export function mountTopbar() {
  const bar = document.getElementById('topbar')
  bar.innerHTML = `
    <div class="topbar__side">
      <button class="btn-glass topbar__back" type="button" data-action="back" hidden>${icons.back}</button>
    </div>
    <img class="topbar__logo" src="./images/subbuteo-logo.png" alt="Subbuteo" />
    <div class="topbar__side topbar__side--right">
      <div data-slot="language"></div>
      <button class="btn-glass" type="button" data-action="fullscreen"></button>
      <button class="btn-glass" type="button" data-action="music"></button>
    </div>
  `

  const backBtn = bar.querySelector('[data-action="back"]')
  const fsBtn = bar.querySelector('[data-action="fullscreen"]')
  const musicBtn = bar.querySelector('[data-action="music"]')
  bar.querySelector('[data-slot="language"]').replaceWith(createLanguageMenu())
  let isFullscreen = false

  const renderMusic = () => {
    const muted = getSettings().musicMuted
    musicBtn.innerHTML = muted ? icons.musicOff : icons.music
    musicBtn.title = muted ? t('topbar.musicOn') : t('topbar.musicOff')
    musicBtn.setAttribute('aria-label', musicBtn.title)
    musicBtn.classList.toggle('is-off', muted)
  }
  const renderFullscreen = (value = isFullscreen) => {
    isFullscreen = value
    fsBtn.innerHTML = value ? icons.shrink : icons.expand
    fsBtn.title = value ? t('topbar.exitFullscreen') : t('topbar.fullscreen')
    fsBtn.setAttribute('aria-label', fsBtn.title)
    document.body.classList.toggle('is-fullscreen', value)
  }
  const renderBack = () => {
    backBtn.title = t('common.back')
    backBtn.setAttribute('aria-label', t('common.back'))
  }

  backBtn.addEventListener('click', () => backHandler?.())
  fsBtn.addEventListener('click', () => window.api.toggleFullscreen())
  musicBtn.addEventListener('click', async () => {
    const muted = !getSettings().musicMuted
    await updateSettings({ musicMuted: muted })
    if (muted) music.stop()
    else if (music.hasTracks) music.start()
    else toast(t('topbar.noTracks'))
  })

  onStateChange((key) => key === 'settings' && renderMusic())
  onLanguageChange(() => {
    renderBack()
    renderMusic()
    renderFullscreen()
  })
  window.api.onFullscreenChange(renderFullscreen)
  window.api.isFullscreen().then(renderFullscreen)
  renderBack()
  renderMusic()
}

// Cada vista decide si muestra el botón de volver y qué hace
export function setBack(handler) {
  backHandler = handler
  document.querySelector('.topbar__back').hidden = !handler
}
