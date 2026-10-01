// Datos por defecto de la app. Los equipos "builtin" no se pueden eliminar,
// pero sí se puede cambiar su escudo desde Configuración.

export const DEFAULT_TEAMS = [
  { id: 'fc-barcelona', name: 'FC Barcelona', colors: ['#004d98', '#a50044'] },
  { id: 'atletico-madrid', name: 'Atlético de Madrid', colors: ['#cb3524', '#ffffff'] },
  { id: 'arsenal', name: 'Arsenal', colors: ['#ef0107', '#ffffff'] },
  { id: 'west-ham-united', name: 'West Ham United', colors: ['#7a263a', '#1bb1e7'] },
  { id: 'badalona-cf', name: 'Badalona CF', colors: ['#d71920', '#ffffff'] },
  { id: 'ue-sant-andreu', name: 'UE Sant Andreu', colors: ['#d71920', '#ffd200'] },
  { id: 'espana', name: 'España', colors: ['#aa151b', '#f1bf00'] },
  { id: 'brasil', name: 'Brasil', colors: ['#009c3b', '#ffdf00'] },
  { id: 'argentina', name: 'Argentina', colors: ['#75aadb', '#ffffff'] },
  { id: 'catalunya', name: 'Catalunya', colors: ['#fcdd09', '#da121a'] }
].map((team) => ({ ...team, builtin: true, crest: `crests/${team.id}.svg` }))

export const DEFAULT_SETTINGS = {
  // Idioma con el que se abre la app: es, ca, en, it
  language: 'es',
  // Duración de cada parte, en minutos
  durations: [5, 10, 15, 20, 25, 30, 45],
  defaultDuration: 15,
  startFullscreen: true,
  keepAwake: true,
  volumes: { effects: 0.8, music: 0.35 },
  musicMuted: false,
  // null = sonido incluido en la app; si no, URL media:// de un archivo importado
  sounds: { goal: null, whistleStart: null, whistlePause: null, whistleEnd: null },
  // Lista de reproducción de música de fondo (vacía = sin música)
  music: { tracks: [], shuffle: false }
}

export const DEFAULT_STATE = {
  version: 1,
  settings: DEFAULT_SETTINGS,
  teams: DEFAULT_TEAMS,
  matches: []
}
