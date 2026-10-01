import { toast } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { findTeam, getSettings, getTeams } from '../core/state.js'
import { crestUrl, esc, readLocal, writeLocal } from '../core/utils.js'

const SIDES = [
  { key: 'home', label: 'Jugador 1' },
  { key: 'away', label: 'Jugador 2' }
]
const MAX_INITIAL = 20

// Recupera la última configuración usada, descartando lo que ya no exista
function initialConfig() {
  const teams = getTeams()
  const { durations, defaultDuration } = getSettings()
  const last = readLocal('lastSetup', {})
  const side = (key, fallbackIndex) => ({
    teamId: findTeam(last[key]?.teamId) ? last[key].teamId : teams[fallbackIndex]?.id,
    player: last[key]?.player ?? '',
    initial: 0
  })
  const config = {
    home: side('home', 0),
    away: side('away', 1),
    duration: durations.includes(last.duration) ? last.duration : defaultDuration
  }
  if (config.home.teamId === config.away.teamId) {
    config.away.teamId = teams.find((t) => t.id !== config.home.teamId)?.id
  }
  return config
}

function teamCard({ key, label }, config) {
  const side = config[key]
  const options = getTeams()
    .map((t) => `<option value="${esc(t.id)}" ${t.id === side.teamId ? 'selected' : ''}>${esc(t.name)}</option>`)
    .join('')

  return `
    <article class="panel team-card" data-side="${key}">
      <span class="panel__label">${label}</span>
      <img class="team-card__crest" data-crest alt="" />
      <label class="field">
        <span class="field__label">Equipo</span>
        <select class="input" data-field="teamId">${options}</select>
      </label>
      <label class="field">
        <span class="field__label">Nombre del jugador</span>
        <input class="input" data-field="player" maxlength="24" placeholder="${label}" value="${esc(side.player)}" />
      </label>
      <div class="field">
        <span class="field__label">Marcador inicial</span>
        <div class="stepper">
          <button class="btn-icon" type="button" data-step="-1" title="Restar">${icons.minus}</button>
          <output class="stepper__value" data-initial>${side.initial}</output>
          <button class="btn-icon" type="button" data-step="1" title="Sumar">${icons.plus}</button>
        </div>
      </div>
    </article>
  `
}

export function setupView(container) {
  setBack(() => go('home'))
  const config = initialConfig()
  const { durations } = getSettings()

  container.innerHTML = `
    <section class="setup">
      <h1 class="screen-title">Nuevo partido</h1>
      <div class="setup__grid grid gap-8">
        ${teamCard(SIDES[0], config)}
        <aside class="panel setup__center flex flex-col items-center gap-6">
          <span class="panel__label">Partido</span>
          <div class="vs-badge" aria-hidden="true">VS</div>
          <label class="field w-full">
            <span class="field__label">Duración de cada parte</span>
            <select class="input" data-field="duration">
              ${durations.map((d) => `<option value="${d}" ${d === config.duration ? 'selected' : ''}>${d} minutos</option>`).join('')}
            </select>
          </label>
          <p class="setup__summary" data-summary></p>
          <button class="btn btn--xl mt-auto w-full" type="button" data-action="start">Comenzar partido</button>
        </aside>
        ${teamCard(SIDES[1], config)}
      </div>
    </section>
  `
  const root = container.firstElementChild

  const render = () => {
    for (const { key } of SIDES) {
      const card = root.querySelector(`[data-side="${key}"]`)
      const team = findTeam(config[key].teamId)
      const crest = card.querySelector('[data-crest]')
      crest.src = crestUrl(team)
      crest.alt = `Escudo de ${team?.name ?? ''}`
      card.querySelector('[data-initial]').textContent = config[key].initial
      // Un mismo equipo no puede jugar contra sí mismo
      const otherTeam = config[key === 'home' ? 'away' : 'home'].teamId
      card.querySelectorAll('option').forEach((o) => (o.disabled = o.value === otherTeam))
    }
    root.querySelector('[data-summary]').textContent = `2 partes × ${config.duration} min · ${config.duration * 2} min en total`
  }

  root.addEventListener('input', (e) => {
    const field = e.target.dataset.field
    const sideKey = e.target.closest('[data-side]')?.dataset.side
    if (field === 'duration') config.duration = Number(e.target.value)
    else if (sideKey && field) config[sideKey][field] = e.target.value
    render()
  })

  root.addEventListener('click', (e) => {
    const step = e.target.closest('[data-step]')
    if (step) {
      const side = config[step.closest('[data-side]').dataset.side]
      side.initial = Math.min(MAX_INITIAL, Math.max(0, side.initial + Number(step.dataset.step)))
      render()
    }
    if (e.target.closest('[data-action="start"]')) start()
  })

  function start() {
    if (config.home.teamId === config.away.teamId) return toast('Elige dos equipos distintos')
    writeLocal('lastSetup', {
      duration: config.duration,
      home: { teamId: config.home.teamId, player: config.home.player.trim() },
      away: { teamId: config.away.teamId, player: config.away.player.trim() }
    })
    go('match', {
      duration: config.duration,
      sides: Object.fromEntries(
        SIDES.map(({ key, label }) => {
          const team = findTeam(config[key].teamId)
          return [key, {
            teamId: team.id,
            teamName: team.name,
            crest: crestUrl(team),
            player: config[key].player.trim() || label,
            initial: config[key].initial
          }]
        })
      )
    })
  }

  render()
}
