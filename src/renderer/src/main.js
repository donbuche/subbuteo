import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-600.css'
import '@fontsource/barlow/latin-700.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource/barlow-condensed/latin-700-italic.css'
import '@fontsource/barlow-condensed/latin-800-italic.css'
import '@fontsource/anton/latin-400.css'
import './styles/tailwind.css'
import './styles/main.scss'
// Siempre la última: espacio para ajustes rápidos de estilos
import './styles/custom-styles.scss'

import { mountTopbar } from './components/topbar.js'
import { setAppReady } from './core/animate.js'
import { music, preloadSounds } from './core/audio.js'
import { go, registerView } from './core/router.js'
import { getSettings, initState } from './core/state.js'
import { sloganMarkup } from './components/slogan.js'
import { animate } from './core/animate.js'
import { initLanguage } from './i18n/index.js'
import { historyView } from './views/history.js'
import { homeView } from './views/home.js'
import { matchView } from './views/match.js'
import { settingsView } from './views/settings.js'
import { setupView } from './views/setup.js'

// Doble splash: tiempos en ms desde que se abre la ventana (performance.now() cuenta desde la carga).
// Entre los dos no se superan los 5 s: la app queda a la vista a los 4,9 s.
const SPLASH = { studioOut: 2000, appIn: 2150, appOut: 4300, done: 4900 }
const at = (ms, fn) => setTimeout(fn, Math.max(0, ms - performance.now()))

document.body.classList.add(`platform-${window.api.platform}`)

await initState()
initLanguage(getSettings().language)
await music.loadDefaults()

registerView('home', homeView)
registerView('setup', setupView)
registerView('match', matchView)
registerView('history', historyView)
registerView('settings', settingsView)

mountTopbar()
go('home')
preloadSounds()

const splash = document.getElementById('splash')
const studioStage = splash.querySelector('[data-stage="studio"]')
const appStage = splash.querySelector('[data-stage="app"]')
appStage.innerHTML = `<img class="splash__app-logo" src="./images/subbuteo-logo.png" alt="Subbuteo" />${sloganMarkup()}`

// 1 → 2: el estudio se desvanece y deja ver el logo de Subbuteo con el eslogan
at(SPLASH.studioOut, () => studioStage.classList.add('is-leaving'))
at(SPLASH.appIn, () => {
  appStage.classList.add('is-shown')
  animate(appStage.querySelector('.splash__app-logo'), 'zoomIn', { duration: 700 })
  animate(appStage.querySelector('.slogan'), 'fadeInUp', { delay: 300, duration: 600 })
  setTimeout(() => appStage.classList.add('is-entered'), 800)
})
// 2 → app: el splash se funde con la portada, que hace su entrada debajo
at(SPLASH.appOut, () => {
  splash.classList.add('is-leaving')
  setAppReady()
  music.start()
})
at(SPLASH.done, () => splash.remove())
