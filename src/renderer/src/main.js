import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-600.css'
import '@fontsource/barlow/latin-700.css'
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource/barlow-condensed/latin-700-italic.css'
import '@fontsource/barlow-condensed/latin-800-italic.css'
import '@fontsource/anton/latin-400.css'
import '@fontsource/racing-sans-one/latin-400.css'
import './styles/tailwind.css'
import './styles/main.scss'
// Siempre la última: espacio para ajustes rápidos de estilos
import './styles/custom-styles.scss'

import { mountTopbar } from './components/topbar.js'
import { setAppReady } from './core/animate.js'
import { initBackground } from './core/background.js'
import { initClickSound, music, preloadSounds } from './core/audio.js'
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
// Ritmo pausado: cada logo se queda un rato a la vista y los fundidos no se pisan.
// La app queda a la vista a los 9,5 s. Si se cambian, revisar la duración de splash-drift en _splash.scss.
const SPLASH = { studioOut: 3600, appIn: 4800, appOut: 8200, appReady: 8500, done: 9500 }
const at = (ms, fn) => setTimeout(fn, Math.max(0, ms - performance.now()))

document.body.classList.add(`platform-${window.api.platform}`)

await initState()
initLanguage(getSettings().language)
await music.loadDefaults()
await initBackground()

registerView('home', homeView)
registerView('setup', setupView)
registerView('match', matchView)
registerView('history', historyView)
registerView('settings', settingsView)

mountTopbar()
go('home')
preloadSounds()
initClickSound()

const splash = document.getElementById('splash')
const studioStage = splash.querySelector('[data-stage="studio"]')
const appStage = splash.querySelector('[data-stage="app"]')
appStage.innerHTML = `<img class="splash__app-logo" src="./images/subbuteo-logo.png" alt="Subbuteo" />${sloganMarkup()}`

// 1 → 2: el estudio se desvanece y deja ver el logo de Subbuteo con el eslogan
at(SPLASH.studioOut, () => studioStage.classList.add('is-leaving'))
at(SPLASH.appIn, () => {
  appStage.classList.add('is-shown')
  animate(appStage.querySelector('.splash__app-logo'), 'zoomIn', { duration: 1100 })
  animate(appStage.querySelector('.slogan'), 'fadeInUp', { delay: 500, duration: 1000 })
  setTimeout(() => appStage.classList.add('is-entered'), 1400)
})
// 2 → app: el splash se funde con la portada, que hace su entrada debajo
// (un poco después, para que no quede tapada por el principio del fundido)
at(SPLASH.appOut, () => {
  splash.classList.add('is-leaving')
  music.start()
})
at(SPLASH.appReady, setAppReady)
at(SPLASH.done, () => splash.remove())
