// Ayudas sobre animate.css. Las clases se quitan al terminar, así una misma
// animación se puede repetir (p. ej. al cambiar de equipo en el carrusel).
// Con "Reducir movimiento" activado en el sistema, animate.css las anula.
import 'animate.css'
import '../styles/animations.css'

// La app está lista (y visible) cuando el splash empieza a desvanecerse
let markReady
const ready = new Promise((resolve) => (markReady = resolve))
export const appReady = () => ready
export const setAppReady = () => markReady()

// …y la entrada de la portada ha terminado (el primer aviso de música espera a esto)
let markIntroDone
const introDone = new Promise((resolve) => (markIntroDone = resolve))
export const homeIntroDone = () => introDone
export const setHomeIntroDone = () => markIntroDone()

export function animate(el, effect, { delay = 0, duration } = {}) {
  if (!el) return Promise.resolve()
  return new Promise((resolve) => {
    const classes = ['animate__animated', `animate__${effect}`]
    el.classList.remove(...classes)
    void el.offsetWidth // permite relanzar la misma animación
    el.style.animationDelay = delay ? `${delay}ms` : ''
    el.style.animationDuration = duration ? `${duration}ms` : ''
    el.classList.add(...classes)

    const done = (e) => {
      if (e && e.target !== el) return
      el.removeEventListener('animationend', done)
      el.classList.remove(...classes)
      el.style.animationDelay = ''
      el.style.animationDuration = ''
      resolve()
    }
    el.addEventListener('animationend', done)
  })
}

// Entrada escalonada: [[selector | elemento, efecto, retardo ms, duración ms?], ...]
export function enter(root, steps) {
  for (const [target, effect, delay = 0, duration] of steps) {
    const els = typeof target === 'string' ? root.querySelectorAll(target) : [target]
    els.forEach((el) => animate(el, effect, { delay, duration }))
  }
}

// Igual que enter(), pero repartiendo un retardo creciente entre varios elementos
export function stagger(root, selector, effect, { start = 0, step = 60, max = 600, duration } = {}) {
  root.querySelectorAll(selector).forEach((el, i) => animate(el, effect, { delay: Math.min(start + i * step, max), duration }))
}
