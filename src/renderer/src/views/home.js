import { setBack } from '../components/topbar.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { t } from '../i18n/index.js'

export function homeView(container) {
  setBack(null)
  const footer = t('home.footer', {
    heart: icons.heart,
    link: '<a href="https://arianewebdesign.com" target="_blank" rel="noopener">Ariane webdesign</a>'
  })

  container.innerHTML = `
    <section class="home">
      <header class="home__header">
        <img class="home__logo" src="./images/subbuteo-logo.png" alt="Subbuteo" />
      </header>

      <nav class="home__menu flex flex-col items-stretch gap-4">
        <button class="btn btn--xl" type="button" data-go="setup">${icons.play} ${t('home.newMatch')}</button>
        <button class="btn btn--secondary btn--lg" type="button" data-go="history">${t('home.history')}</button>
        <button class="btn btn--secondary btn--lg" type="button" data-go="settings">${t('home.settings')}</button>
      </nav>

      <footer class="home__footer">${footer}</footer>
    </section>
  `
  container.firstElementChild.addEventListener('click', (e) => {
    const target = e.target.closest('[data-go]')
    if (target) go(target.dataset.go)
  })
}
