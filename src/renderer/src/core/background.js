// Fondo de la app (Configuración → Fondo). Sin nada elegido se ve el césped
// dibujado con CSS; si no, una foto de la galería incluida o la imagen propia.
import { getSettings, onStateChange } from './state.js'

let presets = []

export const getBackgroundPresets = () => presets

// El fondo que se ve de verdad: si el elegido ya no existe (p. ej. se quitó
// de la galería en una versión nueva), vuelve al césped
export function currentBackground() {
  const { background, customBackground } = getSettings()
  if (!background) return null
  return background === customBackground || presets.some((p) => p.url === background) ? background : null
}

function applyBackground() {
  const url = currentBackground()
  document.body.classList.toggle('has-photo-bg', Boolean(url))
  if (url) document.body.style.setProperty('--app-photo', `url("${url}")`)
  else document.body.style.removeProperty('--app-photo')
}

export async function initBackground() {
  presets = await window.api.getDefaultBackgrounds()
  applyBackground()
  onStateChange((key) => key === 'settings' && applyBackground())
}
