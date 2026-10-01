// Selector de idioma con banderas. Un <select> nativo no admite imágenes en
// las opciones, así que es un botón + listbox con teclado (flechas, Enter, Esc).
import { icons } from '../core/icons.js'
import { getLanguage, LANGUAGES, onLanguageChange, setLanguage, t } from '../i18n/index.js'
import { el } from '../core/utils.js'

export function createLanguageMenu() {
  const root = el(`
    <div class="lang-menu">
      <button class="lang-menu__button" type="button" aria-haspopup="listbox" aria-expanded="false">
        <img class="lang-menu__flag" alt="" />
        <span class="lang-menu__code"></span>
        <span class="lang-menu__chevron">${icons.down}</span>
      </button>
      <ul class="lang-menu__list" role="listbox" hidden>
        ${LANGUAGES.map((l) => `
          <li class="lang-menu__option" role="option" tabindex="-1" data-lang="${l.code}" lang="${l.code}">
            <img class="lang-menu__flag" src="${l.flag}" alt="" />
            <span>${l.name}</span>
          </li>`).join('')}
      </ul>
    </div>
  `)
  const button = root.querySelector('.lang-menu__button')
  const list = root.querySelector('.lang-menu__list')
  const options = [...list.querySelectorAll('[role="option"]')]

  const isOpen = () => !list.hidden

  function render() {
    const current = LANGUAGES.find((l) => l.code === getLanguage())
    root.querySelector('.lang-menu__button .lang-menu__flag').src = current.flag
    root.querySelector('.lang-menu__code').textContent = current.short
    button.title = t('topbar.language')
    button.setAttribute('aria-label', `${t('topbar.language')}: ${current.name}`)
    list.setAttribute('aria-label', t('topbar.language'))
    options.forEach((o) => o.setAttribute('aria-selected', o.dataset.lang === current.code))
  }

  function open() {
    list.hidden = false
    button.setAttribute('aria-expanded', 'true')
    ;(options.find((o) => o.dataset.lang === getLanguage()) ?? options[0]).focus()
    document.addEventListener('pointerdown', onOutside, true)
  }

  function close({ focusButton = true } = {}) {
    list.hidden = true
    button.setAttribute('aria-expanded', 'false')
    document.removeEventListener('pointerdown', onOutside, true)
    if (focusButton) button.focus()
  }

  function choose(code) {
    close()
    setLanguage(code)
  }

  function onOutside(e) {
    if (!root.contains(e.target)) close({ focusButton: false })
  }

  button.addEventListener('click', () => (isOpen() ? close() : open()))
  button.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      open()
    }
  })

  list.addEventListener('click', (e) => {
    const option = e.target.closest('[data-lang]')
    if (option) choose(option.dataset.lang)
  })
  list.addEventListener('keydown', (e) => {
    // Que las teclas no lleguen a los atajos del partido (Q/A, P/L, Espacio)
    e.stopPropagation()
    const index = options.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') options[(index + 1) % options.length].focus()
    else if (e.key === 'ArrowUp') options[(index - 1 + options.length) % options.length].focus()
    else if (e.key === 'Home') options[0].focus()
    else if (e.key === 'End') options.at(-1).focus()
    else if (e.key === 'Enter' || e.key === ' ') choose(document.activeElement.dataset.lang)
    else if (e.key === 'Escape' || e.key === 'Tab') close({ focusButton: e.key === 'Escape' })
    else return
    e.preventDefault()
  })

  onLanguageChange(render)
  render()
  return root
}
