import { setBack } from '../components/topbar.js'
import { go } from '../core/router.js'

export function homeView(container) {
  setBack(null)
  container.innerHTML = `
    <section class="home">
      <header class="home__header">
        <img class="home__logo" src="./images/subbuteo-logo.svg" alt="Subbuteo" />
        <p class="tagline"><span>Table Soccer</span> Marcador digital</p>
      </header>

      <nav class="home__menu flex flex-col items-stretch gap-5">
        <button class="btn btn--xl" type="button" data-go="setup">Nuevo partido</button>
        <button class="btn btn--xl" type="button" data-go="history">Ver historial de partidos</button>
        <button class="btn btn--xl" type="button" data-go="settings">Configuración</button>
      </nav>

      <footer class="home__footer">The replica of association football · Ariane webdesign</footer>
    </section>
  `
  container.firstElementChild.addEventListener('click', (e) => {
    const target = e.target.closest('[data-go]')
    if (target) go(target.dataset.go)
  })
}
