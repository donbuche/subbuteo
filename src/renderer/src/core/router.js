// Router mínimo: cada vista es una función (contenedor, params) que pinta su
// contenido y devuelve opcionalmente una función de limpieza.
const routes = new Map()
let cleanup = null

export function registerView(name, view) {
  routes.set(name, view)
}

export function go(name, params = {}) {
  const view = routes.get(name)
  if (!view) throw new Error(`Vista desconocida: ${name}`)

  cleanup?.()
  cleanup = null

  const container = document.getElementById('view')
  container.replaceChildren()
  document.body.dataset.view = name
  cleanup = view(container, params) ?? null
  container.scrollTop = 0
}
