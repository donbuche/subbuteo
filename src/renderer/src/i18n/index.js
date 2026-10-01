import ca from './ca.js'
import en from './en.js'
import es from './es.js'
import it from './it.js'

// Cada idioma se muestra con su propio nombre, sea cual sea el idioma activo
export const LANGUAGES = [
  { code: 'es', short: 'ES', name: 'Castellano', locale: 'es-ES', flag: './flags/es.svg' },
  { code: 'ca', short: 'CA', name: 'Català', locale: 'ca-ES', flag: './flags/ca.svg' },
  { code: 'en', short: 'EN', name: 'English', locale: 'en-GB', flag: './flags/en.svg' },
  { code: 'it', short: 'IT', name: 'Italiano', locale: 'it-IT', flag: './flags/it.svg' }
]

const DICTIONARIES = { es, ca, en, it }
const listeners = new Set()
let current = 'es'

export const getLanguage = () => current
export const getLocale = () => LANGUAGES.find((l) => l.code === current).locale
export const isSupported = (code) => code in DICTIONARIES

export function setLanguage(code) {
  if (!isSupported(code) || code === current) return
  current = code
  document.documentElement.lang = code
  listeners.forEach((fn) => fn(code))
}

export function initLanguage(code) {
  current = isSupported(code) ? code : 'es'
  document.documentElement.lang = current
}

export function onLanguageChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// t('setup.summary', { d: 15, total: 30 }); si falta la clave, cae al castellano
export function t(key, params = {}) {
  const text = DICTIONARIES[current][key] ?? es[key] ?? key
  return text.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '')
}

export const hasKey = (key) => key in DICTIONARIES[current]
