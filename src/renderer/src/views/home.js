import { sloganMarkup } from '../components/slogan.js'
import { setBack } from '../components/topbar.js'
import { animate, appReady, enter, setHomeIntroDone, stagger } from '../core/animate.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { t } from '../i18n/index.js'


export function homeView(container) {
  setBack(null)

  function paint({ animated = false } = {}) {
    const footer = t('home.footer', {
      heart: icons.heart,
      link: '<a href="https://arianewebdesign.com" target="_blank" rel="noopener">Ariane webdesign</a>'
    })

    container.innerHTML = `
      <section class="home">
        <header class="home__header">
          <img class="home__logo" src="./images/subbuteo-logo.png" alt="Subbuteo" />
          ${sloganMarkup()}
        </header>

        <nav class="home__menu flex flex-col items-stretch gap-4">
          <button class="btn btn--xl" type="button" data-go="setup">${icons.ball} ${t('home.newMatch')}</button>
          <button class="btn btn--secondary btn--lg" type="button" data-go="history">${icons.history} ${t('home.history')}</button>
          <button class="btn btn--secondary btn--lg" type="button" data-go="settings">${icons.gear} ${t('home.settings')}</button>
        </nav>

        <footer class="home__footer">${footer}</footer>
      </section>
    `
    const root = container.firstElementChild
    root.addEventListener('click', (e) => {
      const target = e.target.closest('[data-go]')
      if (target) go(target.dataset.go)
    })
    if (animated) playEntrance(root)
    else root.classList.add('is-entered')
  }

  async function playEntrance(root) {
    // Bajo el splash no se ve nada: se espera a que empiece a desvanecerse
    root.style.visibility = 'hidden'
    await appReady()
    root.style.visibility = ''
    // Sin barras de desplazamiento mientras dura la entrada (puede empezar tarde, tras el splash)
    const view = document.getElementById('view')
    view.classList.add('is-entering')
    setTimeout(() => view.classList.remove('is-entering'), 1600)
    enter(root, [
      ['.home__logo', 'bounceInDown', 0, 1000],
      ['.slogan', 'backInUp', 350, 900],
      ['.home__footer', 'fadeIn', 1300, 800]
    ])
    stagger(root, '.home__menu .btn', 'fadeInUp', { start: 750, step: 110, duration: 600 })
    // Los filetes del eslogan se despliegan cuando ya está en su sitio
    setTimeout(() => root.classList.add('is-entered'), 1150)
    // Un latido en la llamada a la acción principal, una sola vez
    setTimeout(() => animate(root.querySelector('[data-go="setup"]'), 'pulse', { duration: 900 }), 1900)
    // Lo último en acabar es ese latido (1900 + 900 ms). Con un temporizador y no con
    // la promesa de animate(), por si se sale de la portada antes y no llega a terminar.
    setTimeout(setHomeIntroDone, 2800)
  }

  paint({ animated: true })
  return { relocalize: () => paint() }
}
