// Router mínimo: cada vista es una función (contenedor, params) que pinta su
// contenido y devuelve opcionalmente { cleanup, relocalize }. `relocalize`
// vuelve a pintar los textos sin perder el estado (p. ej. un partido en juego);
// si una vista no la define, al cambiar de idioma se vuelve a abrir desde cero.
import { onLanguageChange } from '../i18n/index.js'

const routes = new Map()
let current = { name: null, params: {}, hooks: {} }

export function registerView(name, view) {
  routes.set(name, view)
}

export function go(name, params = {}) {
  const view = routes.get(name)
  if (!view) throw new Error(`Vista desconocida: ${name}`)

  current.hooks.cleanup?.()

  const container = document.getElementById('view')
  container.replaceChildren()
  document.body.dataset.view = name
  current = { name, params, hooks: view(container, params) ?? {} }
  container.scrollTop = 0
}

onLanguageChange(() => {
  if (!current.name) return
  if (current.hooks.relocalize) current.hooks.relocalize()
  else go(current.name, current.params)
})
