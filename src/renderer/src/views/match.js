import { confirmDialog, openModal } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { animate, enter } from '../core/animate.js'
import { playGoal, playTick, playWhistle } from '../core/audio.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { addMatch, findTeam, getSettings } from '../core/state.js'
import { esc, formatClock, teamName } from '../core/utils.js'
import { t } from '../i18n/index.js'

const KEYS = {
  q: ['home', 1], a: ['home', -1],
  p: ['away', 1], l: ['away', -1]
}

const STATUS_KEY = {
  idle: (half) => `match.status.idle${half}`,
  running: () => 'match.status.running',
  paused: () => 'match.status.paused',
  over: (half) => `match.status.over${half}`
}

// El nombre se traduce si el equipo sigue existiendo (selecciones por defecto)
const sideName = (side) => (findTeam(side.teamId) ? teamName(findTeam(side.teamId)) : side.teamName)

function scoreSide(key, side) {
  const name = sideName(side)
  return `
    <section class="score-side" data-side="${key}">
      <header class="score-side__header">
        <img class="score-side__crest" src="${esc(side.crest)}" alt="" />
        <div class="min-w-0">
          <h2 class="score-side__team">${esc(name)}</h2>
          <p class="score-side__player">${esc(side.player)}</p>
        </div>
      </header>
      <div class="scoreboard">
        <span class="scoreboard__value" data-score>0</span>
        <button class="scoreboard__half scoreboard__half--up" type="button" data-delta="1" aria-label="${esc(t('match.addGoal', { team: name }))}">
          <span class="scoreboard__hint">+1</span>
        </button>
        <button class="scoreboard__half scoreboard__half--down" type="button" data-delta="-1" aria-label="${esc(t('match.removeGoal', { team: name }))}">
          <span class="scoreboard__hint">−1</span>
        </button>
        <span class="scoreboard__flash" aria-hidden="true">${t('match.goal')}</span>
      </div>
    </section>
  `
}

export function matchView(container, params) {
  const { duration, sides } = params
  const halfSeconds = duration * 60
  const m = {
    half: 1,
    status: 'idle',
    remaining: halfSeconds,
    endsAt: null,
    score: { home: sides.home.initial, away: sides.away.initial },
    startedAt: new Date().toISOString(),
    saved: false
  }
  let ticker = null
  let root = null
  const $ = (sel) => root.querySelector(sel)

  let shownPhase = false
  let shownHalf = 1

  function paint({ animated = false } = {}) {
    container.innerHTML = `
      <section class="match">
        ${scoreSide('home', sides.home)}
        <aside class="match__center">
          <div class="half-indicator" role="status">
            <span class="half-pill" data-half="1">${t('match.half1')}</span>
            <span class="half-pill" data-half="2">${t('match.half2')}</span>
          </div>
          <div class="clock" data-clock>00:00</div>
          <p class="clock__status" data-status></p>
          <div class="match__controls">
            <button class="btn-icon" type="button" data-action="reset" title="${t('match.reset')}" aria-label="${t('match.reset')}">${icons.reset}</button>
            <button class="btn-icon btn-icon--primary btn-icon--lg" type="button" data-action="toggle"></button>
            <button class="btn-icon" type="button" data-action="finish" title="${t('match.finishNow')}" aria-label="${t('match.finishNow')}">${icons.stop}</button>
          </div>
          <button class="btn btn--lg" type="button" data-action="phase" hidden></button>
          <p class="match__keys">${t('match.keys')}</p>
        </aside>
        ${scoreSide('away', sides.away)}
      </section>
    `
    root = container.firstElementChild
    root.addEventListener('click', onClick)
    shownPhase = m.status === 'over' && !m.saved
    shownHalf = m.half
    renderAll()
    if (animated) {
      enter(root, [
        ['[data-side="home"]', 'fadeInLeft', 0, 600],
        ['[data-side="away"]', 'fadeInRight', 0, 600],
        ['.match__center', 'zoomIn', 150, 550]
      ])
    }
  }

  /* ---------- Render ---------- */

  function renderScore(key) {
    $(`[data-side="${key}"] [data-score]`).textContent = m.score[key]
    const lead = m.score.home === m.score.away ? null : m.score.home > m.score.away ? 'home' : 'away'
    root.querySelectorAll('.score-side').forEach((s) => s.classList.toggle('is-leading', s.dataset.side === lead))
  }

  function renderClock() {
    const clock = $('[data-clock]')
    clock.textContent = formatClock(m.remaining)
    clock.classList.toggle('is-warning', m.status === 'running' && m.remaining <= 60)
    clock.classList.toggle('is-over', m.status === 'over')
  }

  function renderControls() {
    root.querySelectorAll('.half-pill').forEach((p) => p.classList.toggle('is-active', Number(p.dataset.half) === m.half))
    $('[data-status]').textContent = t(STATUS_KEY[m.status](m.half))

    const toggle = $('[data-action="toggle"]')
    const running = m.status === 'running'
    toggle.innerHTML = running ? icons.pause : icons.play
    toggle.title = running ? t('match.pause') : m.status === 'paused' ? t('match.resume') : t(`match.start${m.half}`)
    toggle.setAttribute('aria-label', toggle.title)
    toggle.disabled = m.saved || (m.status === 'over' && m.half === 2)
    $('[data-action="reset"]').disabled = m.saved || m.status === 'idle'
    $('[data-action="finish"]').disabled = m.saved

    const phase = $('[data-action="phase"]')
    phase.hidden = m.saved || m.status !== 'over'
    phase.innerHTML = m.half === 1 ? `${icons.play} ${t('match.start2')}` : t('match.finish')

    // Al acabar una parte, el botón para seguir entra con un rebote; al cambiar de parte, late el indicador
    if (!phase.hidden && !shownPhase) animate(phase, 'bounceIn', { duration: 700 })
    shownPhase = !phase.hidden
    if (m.half !== shownHalf) animate($('.half-pill.is-active'), 'heartBeat', { duration: 900 })
    shownHalf = m.half
  }

  function renderAll() {
    renderScore('home')
    renderScore('away')
    renderClock()
    renderControls()
  }

  /* ---------- Reloj ---------- */

  function tick() {
    m.remaining = Math.max(0, (m.endsAt - performance.now()) / 1000)
    if (m.remaining <= 0) {
      stopTicker()
      m.status = 'over'
      playWhistle(m.half === 1 ? 'end' : 'final')
      renderControls()
    }
    renderClock()
  }

  function stopTicker() {
    clearInterval(ticker)
    ticker = null
    m.endsAt = null
  }

  function run() {
    m.endsAt = performance.now() + m.remaining * 1000
    m.status = 'running'
    ticker = setInterval(tick, 100)
    playWhistle('start')
    renderAll()
  }

  function pause() {
    tick()
    if (m.status !== 'running') return
    stopTicker()
    m.status = 'paused'
    playWhistle('pause')
    renderAll()
  }

  function startSecondHalf() {
    m.half = 2
    m.remaining = halfSeconds
    run()
  }

  function toggleClock() {
    if (m.saved) return
    if (m.status === 'running') pause()
    else if (m.status === 'over') m.half === 1 ? startSecondHalf() : finish()
    else run()
  }

  async function resetHalf() {
    if (m.status === 'running') pause()
    const ok = await confirmDialog(t('match.resetTitle'), t('match.resetBody'), t('match.resetConfirm'))
    if (!ok) return
    stopTicker()
    m.status = 'idle'
    m.remaining = halfSeconds
    renderAll()
  }

  /* ---------- Goles ---------- */

  function changeScore(key, delta) {
    if (m.saved) return
    const next = Math.max(0, m.score[key] + delta)
    if (next === m.score[key]) return
    m.score[key] = next
    renderScore(key)

    const board = $(`[data-side="${key}"] .scoreboard`)
    board.classList.remove('is-goal', 'is-undo')
    void board.offsetWidth // reinicia la animación
    board.classList.add(delta > 0 ? 'is-goal' : 'is-undo')
    delta > 0 ? playGoal() : playTick()
  }

  /* ---------- Final ---------- */

  async function finish({ early = false } = {}) {
    if (m.saved) return
    if (early) {
      if (m.status === 'running') pause()
      const ok = await confirmDialog(t('match.finishTitle'), t('match.finishBody'), t('match.finishConfirm'))
      if (!ok) return
    }
    stopTicker()
    m.saved = true
    if (early) playWhistle('final')

    const record = {
      id: crypto.randomUUID(),
      date: m.startedAt,
      endedAt: new Date().toISOString(),
      duration,
      endedEarly: early,
      home: { ...sides.home, teamName: sideName(sides.home), score: m.score.home },
      away: { ...sides.away, teamName: sideName(sides.away), score: m.score.away }
    }
    await addMatch(record)
    renderAll()
    showResult(record)
  }

  async function showResult(record) {
    const { home, away } = record
    const winner = home.score === away.score ? t('match.draw') : t('match.wins', { name: home.score > away.score ? home.player : away.player })
    const choice = await openModal({
      title: t('match.resultTitle'),
      dismissable: false,
      body: `
        <div class="result">
          <div class="result__side"><img src="${esc(home.crest)}" alt="" /><strong>${esc(home.teamName)}</strong><span>${esc(home.player)}</span></div>
          <div class="result__score" data-animate="rubberBand" data-delay="250">${home.score}<span>–</span>${away.score}</div>
          <div class="result__side"><img src="${esc(away.crest)}" alt="" /><strong>${esc(away.teamName)}</strong><span>${esc(away.player)}</span></div>
        </div>
        <p class="result__winner" data-animate="tada" data-delay="550">${esc(winner)} · ${t('match.saved')}</p>`,
      actions: [
        { label: t('match.toMenu'), value: 'home', variant: 'secondary' },
        { label: t('match.toHistory'), value: 'history', variant: 'secondary' },
        { label: t('match.rematch'), value: 'rematch' }
      ]
    })
    if (choice === 'rematch') go('match', params)
    else go(choice)
  }

  // Confirma el abandono si hay un partido en curso sin guardar
  async function confirmLeave({ quitting = false } = {}) {
    const inProgress = !m.saved && (m.status !== 'idle' || m.half > 1 || m.score.home !== sides.home.initial || m.score.away !== sides.away.initial)
    if (!inProgress) return true
    if (m.status === 'running') pause()
    return quitting
      ? confirmDialog(t('app.quitTitle'), t('app.quitBody'), t('app.quitConfirm'))
      : confirmDialog(t('match.leaveTitle'), t('match.leaveBody'), t('match.leaveConfirm'))
  }

  async function leave() {
    if (await confirmLeave()) go('home')
  }

  /* ---------- Eventos ---------- */

  function onClick(e) {
    const half = e.target.closest('[data-delta]')
    if (half) return changeScore(half.closest('[data-side]').dataset.side, Number(half.dataset.delta))

    const action = e.target.closest('[data-action]')?.dataset.action
    if (action === 'toggle') toggleClock()
    if (action === 'reset') resetHalf()
    if (action === 'finish') finish({ early: true })
    if (action === 'phase') m.half === 1 ? startSecondHalf() : finish()
  }

  const onKey = (e) => {
    if (document.querySelector('.modal') || e.metaKey || e.ctrlKey || e.repeat) return
    if (e.target.closest?.('select, input, .lang-menu')) return
    if (e.code === 'Space') {
      e.preventDefault()
      // Evita que el botón con foco también reciba la pulsación de espacio
      document.activeElement?.blur()
      return toggleClock()
    }
    const mapping = KEYS[e.key.toLowerCase()]
    if (mapping) changeScore(...mapping)
  }
  document.addEventListener('keydown', onKey)

  setBack(leave)
  if (getSettings().keepAwake) window.api.keepAwake(true)
  paint({ animated: true })

  return {
    relocalize: () => paint(),
    confirmLeave: () => confirmLeave({ quitting: true }),
    cleanup() {
      stopTicker()
      document.removeEventListener('keydown', onKey)
      window.api.keepAwake(false)
    }
  }
}
