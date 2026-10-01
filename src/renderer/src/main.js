import '@fontsource-variable/archivo/standard.css'
import '@fontsource-variable/archivo/standard-italic.css'
import '@fontsource/anton/400.css'
import './styles/tailwind.css'
import './styles/main.scss'
// Siempre la última: espacio para ajustes rápidos de estilos
import './styles/custom-styles.scss'

import { mountTopbar } from './components/topbar.js'
import { music } from './core/audio.js'
import { go, registerView } from './core/router.js'
import { initState } from './core/state.js'
import { historyView } from './views/history.js'
import { homeView } from './views/home.js'
import { matchView } from './views/match.js'
import { settingsView } from './views/settings.js'
import { setupView } from './views/setup.js'

document.body.classList.add(`platform-${window.api.platform}`)

await initState()

registerView('home', homeView)
registerView('setup', setupView)
registerView('match', matchView)
registerView('history', historyView)
registerView('settings', settingsView)

mountTopbar()
go('home')
music.start()
