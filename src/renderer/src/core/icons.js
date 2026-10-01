// Iconos SVG inline (trazo, 24×24) para no depender de librerías externas.
const icon = (paths, extra = '') =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${paths}</svg>`

export const icons = {
  play: icon('<path d="M7 4.5v15l12-7.5z" fill="currentColor"/>'),
  pause: icon('<path d="M8 5v14M16 5v14"/>'),
  reset: icon('<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>'),
  stop: icon('<rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/>'),
  close: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
  back: icon('<path d="M15 5l-7 7 7 7"/>'),
  music: icon('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>'),
  musicOff: icon('<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/><path d="M3 3l18 18"/>'),
  expand: icon('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'),
  shrink: icon('<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'),
  trash: icon('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  plus: icon('<path d="M12 5v14M5 12h14"/>'),
  minus: icon('<path d="M5 12h14"/>'),
  upload: icon('<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>'),
  download: icon('<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>'),
  volume: icon('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7"/>'),
  undo: icon('<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'),
  up: icon('<path d="M6 15l6-6 6 6"/>'),
  down: icon('<path d="M6 9l6 6 6-6"/>'),
  // Balón: pentágono central, costuras y cinco parches en el borde
  ball: icon('<circle cx="12" cy="12" r="9.6"/><path d="M12.00 8.30 L15.52 10.86 L14.17 14.99 L9.83 14.99 L8.48 10.86Z" fill="currentColor" stroke-width="1.4"/><path d="M12.00 8.30L12.00 5.60M15.52 10.86L18.09 10.02M14.17 14.99L15.76 17.18M9.83 14.99L8.24 17.18M8.48 10.86L5.91 10.02" stroke-width="1.6"/><path d="M12.00 5.60L8.56 3.04L15.44 3.04ZM18.09 10.02L19.46 5.96L21.59 12.50ZM15.76 17.18L20.05 17.23L14.48 21.27ZM8.24 17.18L9.52 21.27L3.95 17.23ZM5.91 10.02L2.41 12.50L4.54 5.96Z" fill="currentColor" stroke-width="1.2"/>'),
  // Historial: reloj con flecha de vuelta atrás
  history: icon('<path d="M3.5 12a8.5 8.5 0 1 0 2.5-6"/><path d="M3 3.5V8h4.5"/><path d="M12 7.5V12l3.2 2"/>'),
  // Configuración: engranaje de 8 dientes
  gear: icon('<path d="M19.15 10.08 L21.88 10.44 L21.88 13.56 L19.15 13.92 L18.41 15.70 L20.09 17.88 L17.88 20.09 L15.70 18.41 L13.92 19.15 L13.56 21.88 L10.44 21.88 L10.08 19.15 L8.30 18.41 L6.12 20.09 L3.91 17.88 L5.59 15.70 L4.85 13.92 L2.12 13.56 L2.12 10.44 L4.85 10.08 L5.59 8.30 L3.91 6.12 L6.12 3.91 L8.30 5.59 L10.08 4.85 L10.44 2.12 L13.56 2.12 L13.92 4.85 L15.70 5.59 L17.88 3.91 L20.09 6.12 L18.41 8.30 Z" stroke-width="2"/><circle cx="12" cy="12" r="3.2"/>'),
  power: icon('<path d="M12 3v9"/><path d="M6.4 6.6a8 8 0 1 0 11.2 0"/>'),
  globe: icon('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z"/>'),
  heart: '<svg class="icon icon--heart" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.6 2.6h1.4c1-1.5 2.5-2.6 4.6-2.6 3.7 0 5.8 3.7 4.3 7.2C19.5 16.4 12 21 12 21z"/></svg>'
}
