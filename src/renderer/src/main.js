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
import { music, preloadSounds } from './core/audio.js'
import { go, registerView } from './core/router.js'
import { getSettings, initState } from './core/state.js'
import { initLanguage, t } from './i18n/index.js'
import { historyView } from './views/history.js'
import { homeView } from './views/home.js'
import { matchView } from './views/match.js'
import { settingsView } from './views/settings.js'
import { setupView } from './views/setup.js'

// El splash dura 5 s desde que se abre la ventana (performance.now() cuenta desde la carga)
const SPLASH_DURATION = 5000

document.body.classList.add(`platform-${window.api.platform}`)

await initState()
initLanguage(getSettings().language)
document.querySelector('[data-splash-credit]').textContent = t('splash.credit')
await music.loadDefaults()

registerView('home', homeView)
registerView('setup', setupView)
registerView('match', matchView)
registerView('history', historyView)
registerView('settings', settingsView)

mountTopbar()
go('home')
preloadSounds()

setTimeout(() => {
  const splash = document.getElementById('splash')
  splash.classList.add('is-leaving')
  splash.addEventListener('animationend', () => splash.remove(), { once: true })
  music.start()
}, Math.max(0, SPLASH_DURATION - performance.now()))
