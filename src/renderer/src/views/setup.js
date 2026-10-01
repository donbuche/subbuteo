import { toast } from '../components/modal.js'
import { mountTeamCarousel, teamCarouselMarkup } from '../components/team-carousel.js'
import { animate, enter } from '../core/animate.js'
import { setBack } from '../components/topbar.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { findTeam, getSettings, getTeams } from '../core/state.js'
import { crestUrl, esc, readLocal, teamName, writeLocal } from '../core/utils.js'
import { t } from '../i18n/index.js'

const SIDES = [
  { key: 'home', label: 'setup.player1' },
  { key: 'away', label: 'setup.player2' }
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
    config.away.teamId = teams.find((team) => team.id !== config.home.teamId)?.id
  }
  return config
}

function teamCard({ key, label }, config) {
  const side = config[key]
  return `
    <article class="panel team-card" data-side="${key}">
      <span class="panel__label">${t(label)}</span>
      <div class="team-card__picker">
        ${teamCarouselMarkup(getTeams())}
        <p class="team-card__name" data-team-name aria-live="polite"></p>
        <p class="team-card__taken" data-taken hidden></p>
      </div>
      <label class="field">
        <span class="field__label">${t('setup.playerName')}</span>
        <input class="input" data-field="player" maxlength="24" placeholder="${t(label)}" value="${esc(side.player)}" />
      </label>
      <div class="field">
        <span class="field__label">${t('setup.initialScore')}</span>
        <div class="stepper">
          <button class="btn-icon" type="button" data-step="-1" title="${t('setup.subtract')}" aria-label="${t('setup.subtract')}">${icons.minus}</button>
          <output class="stepper__value" data-initial>${side.initial}</output>
          <button class="btn-icon" type="button" data-step="1" title="${t('setup.add')}" aria-label="${t('setup.add')}">${icons.plus}</button>
        </div>
      </div>
    </article>
  `
}

export function setupView(container) {
  setBack(() => go('home'))
  const config = initialConfig()
  let root = null
  let carousels = []

  const destroyCarousels = () => {
    carousels.forEach((c) => c.destroy())
    carousels = []
  }

  function paint({ animated = false } = {}) {
    destroyCarousels()
    const { durations } = getSettings()
    container.innerHTML = `
      <section class="setup">
        <h1 class="screen-title">${t('setup.title')}</h1>
        <div class="setup__grid grid gap-8">
          ${teamCard(SIDES[0], config)}
          <aside class="panel setup__center flex flex-col items-center gap-6">
            <span class="panel__label">${t('setup.match')}</span>
            <div class="vs-badge" aria-hidden="true">VS</div>
            <label class="field w-full">
              <span class="field__label">${t('setup.duration')}</span>
              <select class="input" data-field="duration">
                ${durations.map((d) => `<option value="${d}" ${d === config.duration ? 'selected' : ''}>${t('common.minutes', { n: d })}</option>`).join('')}
              </select>
            </label>
            <p class="setup__summary" data-summary></p>
            <button class="btn btn--xl mt-auto w-full" type="button" data-action="start">${icons.play} ${t('setup.start')}</button>
          </aside>
          ${teamCard(SIDES[1], config)}
        </div>
      </section>
    `
    root = container.firstElementChild
    root.addEventListener('input', onInput)
    root.addEventListener('click', onClick)
    carousels = SIDES.map(({ key }) =>
      mountTeamCarousel(root.querySelector(`[data-side="${key}"] .team-carousel`), {
        teams: getTeams(),
        selectedId: config[key].teamId,
        onChange: (teamId) => {
          const wasTaken = config[key].teamId === config[key === 'home' ? 'away' : 'home'].teamId
          config[key].teamId = teamId
          render()
          const card = root.querySelector(`[data-side="${key}"]`)
          animate(card.querySelector('[data-team-name]'), 'fadeIn', { duration: 320 })
          const taken = card.querySelector('[data-taken]')
          if (!taken.hidden && !wasTaken) animate(taken, 'headShake', { duration: 600 })
        }
      })
    )
    render()
    if (animated) {
      enter(root, [
        ['.screen-title', 'fadeInDown', 0, 500],
        ['[data-side="home"]', 'fadeInLeft', 80, 600],
        ['.setup__center', 'fadeInUp', 160, 600],
        ['[data-side="away"]', 'fadeInRight', 80, 600],
        ['.vs-badge', 'zoomIn', 500, 500],
        ['[data-action="start"]', 'pulse', 1100, 900]
      ])
    }
  }

  function render() {
    for (const { key } of SIDES) {
      const card = root.querySelector(`[data-side="${key}"]`)
      const team = findTeam(config[key].teamId)
      card.querySelector('[data-team-name]').textContent = teamName(team)
      card.querySelector('[data-initial]').textContent = config[key].initial

      // Un mismo equipo no puede jugar contra sí mismo: se marca el que ya eligió el rival
      const other = SIDES.find((s) => s.key !== key)
      const otherTeam = config[other.key].teamId
      card.querySelectorAll('[data-team-id]').forEach((slide) => slide.classList.toggle('is-taken', slide.dataset.teamId === otherTeam))
      const taken = card.querySelector('[data-taken]')
      taken.hidden = team?.id !== otherTeam
      taken.textContent = t('setup.taken', { player: config[other.key].player.trim() || t(other.label) })
    }
    root.querySelector('[data-action="start"]').disabled = config.home.teamId === config.away.teamId
    root.querySelector('[data-summary]').textContent = t('setup.summary', { d: config.duration, total: config.duration * 2 })
  }

  function onInput(e) {
    const field = e.target.dataset.field
    const sideKey = e.target.closest('[data-side]')?.dataset.side
    if (field === 'duration') config.duration = Number(e.target.value)
    else if (sideKey && field) config[sideKey][field] = e.target.value
    render()
  }

  function onClick(e) {
    const step = e.target.closest('[data-step]')
    if (step) {
      const side = config[step.closest('[data-side]').dataset.side]
      side.initial = Math.min(MAX_INITIAL, Math.max(0, side.initial + Number(step.dataset.step)))
      render()
    }
    if (e.target.closest('[data-action="start"]')) start()
  }

  function start() {
    if (config.home.teamId === config.away.teamId) return toast(t('setup.sameTeam'))
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
            teamName: teamName(team),
            crest: crestUrl(team),
            player: config[key].player.trim() || t(label),
            initial: config[key].initial
          }]
        })
      )
    })
  }

  paint({ animated: true })
  return { relocalize: () => paint(), cleanup: destroyCarousels }
}
