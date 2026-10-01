// Genera un escudo SVG provisional a partir de dos colores y unas iniciales.
// Se usa para los escudos por defecto (scripts/generate-crests.mjs) y para
// los equipos nuevos a los que no se les asigna una imagen.

const SHIELD = 'M12 12 H188 V118 C188 176 142 212 100 230 C58 212 12 176 12 118 Z'

const escapeXml = (text) =>
  String(text).replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c])

export function initialsFor(name) {
  const words = String(name)
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter((w) => w && !['de', 'del', 'la', 'el', 'the'].includes(w.toLowerCase()))
  if (!words.length) return '?'
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase()
  return words.slice(0, 4).map((w) => w[0]).join('').toUpperCase()
}

export function crestSvg({ colors = ['#d71920', '#ffffff'], initials = '?' }) {
  const [a, b] = colors
  const stripes = Array.from({ length: 7 }, (_, i) =>
    `<rect x="${12 + i * 25.15}" y="0" width="25.2" height="240" fill="${i % 2 ? b : a}"/>`
  ).join('')
  const size = initials.length > 3 ? 34 : 42

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
  <defs><clipPath id="s"><path d="${SHIELD}"/></clipPath></defs>
  <g clip-path="url(#s)">${stripes}</g>
  <circle cx="100" cy="112" r="50" fill="#ffffff" stroke="#111111" stroke-width="5"/>
  <text x="100" y="${112 + size * 0.35}" text-anchor="middle" font-family="Arial Black, Helvetica Neue, Arial, sans-serif"
    font-weight="900" font-size="${size}" fill="#111111">${escapeXml(initials)}</text>
  <path d="${SHIELD}" fill="none" stroke="#111111" stroke-width="7" stroke-linejoin="round"/>
</svg>`
}

export function crestDataUri(options) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(crestSvg(options))}`
}
