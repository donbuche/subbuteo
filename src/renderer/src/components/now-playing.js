// Aviso "Sonando ahora" bajo el botón de música de la barra superior: aparece cada
// vez que empieza a sonar un tema y se va solo a los pocos segundos.
import { animate, homeIntroDone } from '../core/animate.js'
import { music } from '../core/audio.js'
import { icons } from '../core/icons.js'
import { esc } from '../core/utils.js'
import { t } from '../i18n/index.js'

const VISIBLE_MS = 6000

// "Título · autor" (hilo musical por defecto); los temas propios solo tienen título
const splitName = (name) => {
  const [title, author] = name.split(' · ')
  return { title, author }
}

export function createNowPlaying() {
  const el = document.createElement('div')
  el.className = 'now-playing'
  el.setAttribute('role', 'status')
  el.hidden = true
  let timer = null
  let leaving = null

  const hide = async () => {
    clearTimeout(timer)
    if (el.hidden || leaving) return
    leaving = animate(el, 'fadeOutUp', { duration: 450 })
    await leaving
    leaving = null
    el.hidden = true
  }

  const schedule = () => {
    clearTimeout(timer)
    timer = setTimeout(hide, VISIBLE_MS)
  }

  const show = async (track) => {
    // El primer tema arranca durante el splash: el aviso espera a que la portada haya entrado
    await homeIntroDone()
    if (!music.playing) return // se silenció mientras tanto
    if (leaving) await leaving
    const { title, author } = splitName(track.name)
    el.innerHTML = `
      <span class="now-playing__disc">${icons.music}</span>
      <span class="now-playing__body">
        <span class="now-playing__label">
          <span class="now-playing__eq" aria-hidden="true"><i></i><i></i><i></i></span>
          ${t('topbar.nowPlaying')}
        </span>
        <strong class="now-playing__title">${esc(title)}</strong>
        ${author ? `<span class="now-playing__author">${icons.user} ${esc(author)}</span>` : ''}
      </span>`
    if (el.hidden) {
      el.hidden = false
      animate(el, 'fadeInDown', { duration: 500 })
    } else {
      // Ya estaba a la vista (cambio de tema seguido): solo se renueva el contenido
      animate(el.querySelector('.now-playing__body'), 'fadeIn', { duration: 350 })
    }
    schedule()
  }

  // Mientras el ratón está encima no se va; un clic lo cierra
  el.addEventListener('mouseenter', () => clearTimeout(timer))
  el.addEventListener('mouseleave', () => !el.hidden && schedule())
  el.addEventListener('click', hide)

  return { el, show, hide }
}
