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
  down: icon('<path d="M6 9l6 6 6-6"/>')
}
