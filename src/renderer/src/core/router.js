// Router mínimo: cada vista es una función (contenedor, params) que pinta su
// contenido y devuelve opcionalmente { cleanup, relocalize }. `relocalize`
// vuelve a pintar los textos sin perder el estado (p. ej. un partido en juego);
// si una vista no la define, al cambiar de idioma se vuelve a abrir desde cero.
import { onLanguageChange } from '../i18n/index.js'
import { animate } from './animate.js'

const EXIT_DURATION = 160
const ENTER_LOCK = 1100
let enterTimer = null

const routes = new Map()
let current = { name: null, params: {}, hooks: {} }
let navigation = 0

export function registerView(name, view) {
  routes.set(name, view)
}

export async function go(name, params = {}) {
  const view = routes.get(name)
  if (!view) throw new Error(`Vista desconocida: ${name}`)
  const token = ++navigation

  current.hooks.cleanup?.()
  current = { name: null, params: {}, hooks: {} }

  // Transición de salida corta: la navegación tiene que seguir siendo ágil
  const container = document.getElementById('view')
  const leaving = container.firstElementChild
  if (leaving) {
    leaving.style.pointerEvents = 'none'
    await animate(leaving, 'fadeOut', { duration: EXIT_DURATION })
    if (token !== navigation) return // otra navegación ha empezado mientras tanto
  }

  container.replaceChildren()
  document.body.dataset.view = name
  // Sin scroll mientras duran las animaciones de entrada
  clearTimeout(enterTimer)
  container.classList.add('is-entering')
  enterTimer = setTimeout(() => container.classList.remove('is-entering'), ENTER_LOCK)
  current = { name, params, hooks: view(container, params) ?? {} }
  container.scrollTop = 0
}

// Pregunta a la vista activa si se puede salir (p. ej. un partido en curso)
export async function canLeave() {
  return (await current.hooks.confirmLeave?.()) ?? true
}

onLanguageChange(() => {
  if (!current.name) return
  if (current.hooks.relocalize) current.hooks.relocalize()
  else go(current.name, current.params)
})
