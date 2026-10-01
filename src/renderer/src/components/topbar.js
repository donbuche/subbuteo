import { music } from '../core/audio.js'
import { icons } from '../core/icons.js'
import { getSettings, onStateChange, updateSettings } from '../core/state.js'

let backHandler = null

export function mountTopbar() {
  const bar = document.getElementById('topbar')
  bar.innerHTML = `
    <div class="topbar__side">
      <button class="btn-icon topbar__back" type="button" data-action="back" title="Volver" hidden>${icons.back}</button>
    </div>
    <img class="topbar__logo" src="./images/subbuteo-logo.svg" alt="Subbuteo" />
    <div class="topbar__side topbar__side--right">
      <button class="btn-icon" type="button" data-action="fullscreen" title="Pantalla completa"></button>
      <button class="btn-icon" type="button" data-action="music" title="Música de fondo"></button>
    </div>
  `

  const backBtn = bar.querySelector('[data-action="back"]')
  const fsBtn = bar.querySelector('[data-action="fullscreen"]')
  const musicBtn = bar.querySelector('[data-action="music"]')

  const renderMusic = () => {
    const muted = getSettings().musicMuted
    musicBtn.innerHTML = muted ? icons.musicOff : icons.music
    musicBtn.title = muted ? 'Activar música' : 'Silenciar música'
    musicBtn.classList.toggle('is-off', muted)
  }
  const renderFullscreen = (isFs) => {
    fsBtn.innerHTML = isFs ? icons.shrink : icons.expand
    fsBtn.title = isFs ? 'Salir de pantalla completa' : 'Pantalla completa'
    document.body.classList.toggle('is-fullscreen', isFs)
  }

  backBtn.addEventListener('click', () => backHandler?.())
  fsBtn.addEventListener('click', () => window.api.toggleFullscreen())
  musicBtn.addEventListener('click', async () => {
    const muted = !getSettings().musicMuted
    await updateSettings({ musicMuted: muted })
    muted ? music.stop() : music.start()
    renderMusic()
  })

  onStateChange((key) => key === 'settings' && renderMusic())
  window.api.onFullscreenChange(renderFullscreen)
  window.api.isFullscreen().then(renderFullscreen)
  renderMusic()
}

// Cada vista decide si muestra el botón de volver y qué hace
export function setBack(handler) {
  backHandler = handler
  document.querySelector('.topbar__back').hidden = !handler
}
