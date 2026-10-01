// Copia en memoria del estado persistido por el proceso principal (JSON en userData).
const listeners = new Set()
let state = null

export async function initState() {
  state = await window.api.getState()
}

export const getSettings = () => state.settings
export const getTeams = () => state.teams
export const getMatches = () => state.matches
export const findTeam = (id) => state.teams.find((t) => t.id === id)

async function save(key, value) {
  state[key] = value
  await window.api.set(key, value)
  listeners.forEach((fn) => fn(key, value))
}

export const updateSettings = (patch) => save('settings', { ...state.settings, ...patch })
export const saveTeams = (teams) => save('teams', teams)
export const saveMatches = (matches) => save('matches', matches)
export const addMatch = (match) => saveMatches([match, ...state.matches])

export function onStateChange(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
