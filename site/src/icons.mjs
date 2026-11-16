// Inline SVG icons (24 × 24, stroke based). Drawn for this site.
const stroke = (body) =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

export const icons = {
  tap: stroke('<path d="M9 11V5.5a2 2 0 0 1 4 0V11"/><path d="M13 10a2 2 0 0 1 4 0v2"/><path d="M17 11.5a2 2 0 0 1 4 0V15a7 7 0 0 1-7 7h-.6a7 7 0 0 1-5.5-2.7L4.4 16a2 2 0 0 1 3.1-2.5L9 15"/><path d="M5 5.5a5 5 0 0 1 2-3M17 2.5a5 5 0 0 1 2 3"/>'),
  timer: stroke('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.5 2M9.5 2.5h5M19 6l1.5-1.5"/>'),
  shirt: stroke('<path d="M8.5 3 4 5.2 2 10l3.5 1.6V21h13v-9.4L22 10l-2-4.8L15.5 3a3.5 3.5 0 0 1-7 0z"/>'),
  trophy: stroke('<path d="M8 21h8M12 16.5V21M7 3.5h10V9a5 5 0 0 1-10 0z"/><path d="M17 5h3v1.5A3.5 3.5 0 0 1 16.5 10M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10"/>'),
  sound: stroke('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
  sliders: stroke('<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>'),
  globe: stroke('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9M12 3C9.5 5.6 8.2 8.6 8.2 12s1.3 6.4 3.8 9"/>'),
  screen: stroke('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20M9.5 10l2 2 3.5-3.5"/>'),
  download: stroke('<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>'),
  laptop: stroke('<rect x="4" y="4" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>'),
  play: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 4.8v14.4a1 1 0 0 0 1.5.9l11.3-7.2a1 1 0 0 0 0-1.8L9.5 3.9A1 1 0 0 0 8 4.8z"/></svg>',
  pause: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect fill="currentColor" x="6" y="4" width="4.5" height="16" rx="1.2"/><rect fill="currentColor" x="13.5" y="4" width="4.5" height="16" rx="1.2"/></svg>',
  reset: stroke('<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>'),
  close: stroke('<path d="M6 6l12 12M18 6 6 18"/>'),
  prev: stroke('<path d="M15 5l-7 7 7 7"/>'),
  next: stroke('<path d="M9 5l7 7-7 7"/>'),
  chevron: stroke('<path d="M6 9l6 6 6-6"/>'),
  menu: stroke('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  check: stroke('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
  zoom: stroke('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4M11 8v6M8 11h6"/>'),
  github:
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.4-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
};
