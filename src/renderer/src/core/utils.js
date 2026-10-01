import { crestDataUri, initialsFor } from '@shared/crest-svg.js'

export const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export function el(html) {
  const tpl = document.createElement('template')
  tpl.innerHTML = html.trim()
  return tpl.content.firstElementChild
}

export const crestUrl = (team) => team?.crest || crestDataUri({ colors: team?.colors, initials: initialsFor(team?.name ?? '?') })

export function formatClock(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

const dateFmt = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' })
export const formatDate = (iso) => dateFmt.format(new Date(iso))
export const formatTime = (iso) => timeFmt.format(new Date(iso))

export const slugify = (text) =>
  String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// localStorage solo para comodidades (último partido configurado); puede fallar sin consecuencias
export function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* sin almacenamiento disponible */
  }
}
