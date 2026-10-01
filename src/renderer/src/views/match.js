import { confirmDialog, openModal } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { playGoal, playTick, playWhistle } from '../core/audio.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { addMatch, getSettings } from '../core/state.js'
import { esc, formatClock } from '../core/utils.js'

const KEYS = {
  q: ['home', 1], a: ['home', -1],
  p: ['away', 1], l: ['away', -1]
}

const STATUS_LABEL = {
  idle: (half) => (half === 1 ? 'Preparados' : 'Segunda parte preparada'),
  running: () => 'En juego',
  paused: () => 'Pausado',
  over: (half) => (half === 1 ? 'Descanso' : 'Tiempo cumplido')
}

function scoreSide(key, side) {
  return `
    <section class="score-side" data-side="${key}">
      <header class="score-side__header">
        <img class="score-side__crest" src="${esc(side.crest)}" alt="" />
        <div class="min-w-0">
          <h2 class="score-side__team">${esc(side.teamName)}</h2>
          <p class="score-side__player">${esc(side.player)}</p>
        </div>
      </header>
      <div class="scoreboard">
        <span class="scoreboard__value" data-score>0</span>
        <button class="scoreboard__half scoreboard__half--up" type="button" data-delta="1" aria-label="Sumar gol a ${esc(side.teamName)}">
          <span class="scoreboard__hint">+1</span>
        </button>
        <button class="scoreboard__half scoreboard__half--down" type="button" data-delta="-1" aria-label="Restar gol a ${esc(side.teamName)}">
          <span class="scoreboard__hint">−1</span>
        </button>
        <span class="scoreboard__flash" aria-hidden="true">¡Gol!</span>
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

  container.innerHTML = `
    <section class="match">
      ${scoreSide('home', sides.home)}
      <aside class="match__center">
        <div class="half-indicator" role="status">
          <span class="half-pill" data-half="1">1ª parte</span>
          <span class="half-pill" data-half="2">2ª parte</span>
        </div>
        <div class="clock" data-clock>00:00</div>
        <p class="clock__status" data-status></p>
        <div class="match__controls">
          <button class="btn-icon" type="button" data-action="reset" title="Reiniciar esta parte">${icons.reset}</button>
          <button class="btn-icon btn-icon--lg" type="button" data-action="toggle"></button>
          <button class="btn-icon" type="button" data-action="finish" title="Terminar el partido ahora">${icons.stop}</button>
        </div>
        <button class="btn btn--lg" type="button" data-action="phase" hidden></button>
        <p class="match__keys">Teclado · Q / A jugador 1 · P / L jugador 2 · Espacio reloj</p>
      </aside>
      ${scoreSide('away', sides.away)}
    </section>
  `
  const root = container.firstElementChild
  const $ = (sel) => root.querySelector(sel)

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
    $('[data-status]').textContent = STATUS_LABEL[m.status](m.half)

    const toggle = $('[data-action="toggle"]')
    const running = m.status === 'running'
    toggle.innerHTML = running ? icons.pause : icons.play
    toggle.title = running ? 'Pausar' : m.status === 'paused' ? 'Reanudar' : `Iniciar ${m.half}ª parte`
    toggle.disabled = m.saved || (m.status === 'over' && m.half === 2)
    $('[data-action="reset"]').disabled = m.saved || m.status === 'idle'
    $('[data-action="finish"]').disabled = m.saved

    const phase = $('[data-action="phase"]')
    phase.hidden = m.saved || m.status !== 'over'
    phase.textContent = m.half === 1 ? 'Iniciar 2ª parte' : 'Finalizar partido'
  }

  const renderAll = () => {
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
    const wasRunning = m.status === 'running'
    if (wasRunning) pause()
    const ok = await confirmDialog(`Reiniciar la ${m.half}ª parte`, 'El reloj volverá al tiempo inicial de esta parte. El marcador no cambia.', 'Reiniciar')
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
      const ok = await confirmDialog('Terminar el partido', 'Se guardará el resultado actual en el historial.', 'Terminar y guardar')
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
      home: { ...sides.home, score: m.score.home },
      away: { ...sides.away, score: m.score.away }
    }
    await addMatch(record)
    renderAll()
    showResult(record)
  }

  async function showResult(record) {
    const { home, away } = record
    const winner = home.score === away.score ? 'Empate' : `Gana ${home.score > away.score ? home.player : away.player}`
    const choice = await openModal({
      title: 'Final del partido',
      dismissable: false,
      body: `
        <div class="result">
          <div class="result__side"><img src="${esc(home.crest)}" alt="" /><strong>${esc(home.teamName)}</strong><span>${esc(home.player)}</span></div>
          <div class="result__score">${home.score}<span>–</span>${away.score}</div>
          <div class="result__side"><img src="${esc(away.crest)}" alt="" /><strong>${esc(away.teamName)}</strong><span>${esc(away.player)}</span></div>
        </div>
        <p class="result__winner">${esc(winner)} · Guardado en el historial</p>`,
      actions: [
        { label: 'Menú principal', value: 'home', variant: 'ghost' },
        { label: 'Ver historial', value: 'history', variant: 'ghost' },
        { label: 'Revancha', value: 'rematch' }
      ]
    })
    if (choice === 'rematch') go('match', params)
    else go(choice)
  }

  async function leave() {
    const inProgress = !m.saved && (m.status !== 'idle' || m.half > 1 || m.score.home !== sides.home.initial || m.score.away !== sides.away.initial)
    if (inProgress) {
      if (m.status === 'running') pause()
      const ok = await confirmDialog('Abandonar el partido', 'El partido no se guardará en el historial.', 'Abandonar')
      if (!ok) return
    }
    go('home')
  }

  /* ---------- Eventos ---------- */

  root.addEventListener('click', (e) => {
    const half = e.target.closest('[data-delta]')
    if (half) return changeScore(half.closest('[data-side]').dataset.side, Number(half.dataset.delta))

    const action = e.target.closest('[data-action]')?.dataset.action
    if (action === 'toggle') toggleClock()
    if (action === 'reset') resetHalf()
    if (action === 'finish') finish({ early: true })
    if (action === 'phase') m.half === 1 ? startSecondHalf() : finish()
  })

  const onKey = (e) => {
    if (document.querySelector('.modal') || e.metaKey || e.ctrlKey || e.repeat) return
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
  renderAll()

  return () => {
    stopTicker()
    document.removeEventListener('keydown', onKey)
    window.api.keepAwake(false)
  }
}
