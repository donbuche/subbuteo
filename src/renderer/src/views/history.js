import { confirmDialog, toast } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { animate, enter, stagger } from '../core/animate.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { getMatches, saveMatches } from '../core/state.js'
import { esc, formatDate, formatTime } from '../core/utils.js'
import { t } from '../i18n/index.js'

const outcome = (own, other) => (own > other ? 'win' : own < other ? 'loss' : 'draw')

function matchRow(match) {
  const { home, away } = match
  const result = outcome(home.score, away.score)
  const side = (s, winning) => `
    <div class="history-row__team ${winning ? 'is-winner' : ''}">
      <img src="${esc(s.crest)}" alt="" />
      <div class="min-w-0">
        <strong>${esc(s.teamName)}</strong>
        <span>${esc(s.player)}</span>
      </div>
    </div>`

  return `
    <li class="history-row panel" data-id="${esc(match.id)}">
      <div class="history-row__date">
        <strong>${formatDate(match.date)}</strong>
        <span>${formatTime(match.date)} · 2×${match.duration}′${match.endedEarly ? ` · ${t('history.endedEarly')}` : ''}</span>
      </div>
      ${side(home, result === 'win')}
      <div class="history-row__score">${home.score}<span>–</span>${away.score}</div>
      ${side(away, result === 'loss')}
      <button class="btn-icon btn-icon--sm" type="button" data-delete title="${t('history.delete')}" aria-label="${t('history.delete')}">${icons.trash}</button>
    </li>`
}

// Clasificación por jugador: 3 puntos victoria, 1 empate
function standings(matches) {
  const table = new Map()
  const row = (name) => {
    const key = name.trim().toLowerCase()
    if (!table.has(key)) table.set(key, { name: name.trim(), pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 })
    return table.get(key)
  }
  for (const { home, away } of matches) {
    for (const [own, other] of [[home, away], [away, home]]) {
      const r = row(own.player)
      r.pj++
      r.gf += own.score
      r.gc += other.score
      r[{ win: 'g', draw: 'e', loss: 'p' }[outcome(own.score, other.score)]]++
    }
  }
  return [...table.values()]
    .map((r) => ({ ...r, dg: r.gf - r.gc, pts: r.g * 3 + r.e }))
    .sort((a, b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || a.name.localeCompare(b.name))
}

function standingsTable(matches) {
  const cols = ['played', 'won', 'drawn', 'lost', 'for', 'against', 'diff', 'points'].map((c) => `<th>${t(`history.col.${c}`)}</th>`).join('')
  return `
    <div class="panel standings">
      <table>
        <thead><tr><th>#</th><th class="text-left">${t('history.col.player')}</th>${cols}</tr></thead>
        <tbody>
          ${standings(matches).map((r, i) => `
            <tr>
              <td>${i + 1}</td><td class="text-left"><strong>${esc(r.name)}</strong></td>
              <td>${r.pj}</td><td>${r.g}</td><td>${r.e}</td><td>${r.p}</td>
              <td>${r.gf}</td><td>${r.gc}</td><td>${r.dg > 0 ? '+' : ''}${r.dg}</td><td><strong>${r.pts}</strong></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`
}

function toCsv(matches) {
  const cell = (v) => `"${String(v).replace(/"/g, '""')}"`
  const header = ['date', 'time', 'duration', 'team1', 'player1', 'goals1', 'goals2', 'player2', 'team2', 'endedEarly'].map((k) => t(`history.csv.${k}`))
  const lines = matches.map((m) => [
    formatDate(m.date), formatTime(m.date), m.duration,
    m.home.teamName, m.home.player, m.home.score,
    m.away.score, m.away.player, m.away.teamName,
    t(m.endedEarly ? 'history.csv.yes' : 'history.csv.no')
  ].map(cell).join(';'))
  return '﻿' + [header.map(cell).join(';'), ...lines].join('\n')
}

export function historyView(container) {
  setBack(() => go('home'))
  let tab = 'matches'
  let root = null

  function paint({ animated = false } = {}) {
    container.innerHTML = `
      <section class="history">
        <div class="screen-head">
          <h1 class="screen-title">${t('history.title')}</h1>
          <div class="screen-head__tools">
            <div class="segmented" role="tablist">
              <button class="segmented__item" type="button" role="tab" data-tab="matches">${t('history.tabMatches')}</button>
              <button class="segmented__item" type="button" role="tab" data-tab="standings">${t('history.tabStandings')}</button>
            </div>
            <button class="btn btn--secondary" type="button" data-action="export">${icons.download} ${t('history.export')}</button>
            <button class="btn btn--outline" type="button" data-action="clear">${icons.trash} ${t('history.clear')}</button>
          </div>
        </div>
        <div data-content></div>
      </section>
    `
    root = container.firstElementChild
    root.addEventListener('click', onClick)
    render({ animated })
    if (animated) enter(root, [['.screen-title', 'fadeInDown', 0, 500], ['.screen-head__tools', 'fadeIn', 150, 600]])
  }

  function render({ animated = false } = {}) {
    const matches = getMatches()
    root.querySelectorAll('[data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab))
    root.querySelectorAll('[data-action]').forEach((b) => (b.disabled = !matches.length))
    const content = root.querySelector('[data-content]')

    if (!matches.length) {
      content.innerHTML = `
        <div class="panel empty-state">
          <p>${t('history.empty')}</p>
          <button class="btn btn--lg" type="button" data-new>${icons.play} ${t('home.newMatch')}</button>
        </div>`
      return
    }
    content.innerHTML = tab === 'matches'
      ? `<ul class="history-list">${matches.map(matchRow).join('')}</ul>`
      : standingsTable(matches)
    if (animated) stagger(content, '.history-row, .standings', 'fadeInUp', { start: 150, step: 60, max: 600, duration: 500 })
  }

  async function onClick(e) {
    const tabBtn = e.target.closest('[data-tab]')
    if (tabBtn) {
      tab = tabBtn.dataset.tab
      render()
      return animate(root.querySelector('[data-content]').firstElementChild, 'fadeIn', { duration: 300 })
    }
    if (e.target.closest('[data-new]')) return go('setup')

    const del = e.target.closest('[data-delete]')
    if (del) {
      const id = del.closest('[data-id]').dataset.id
      if (await confirmDialog(t('history.delete'), t('history.deleteBody'), t('history.deleteConfirm'))) {
        await animate(del.closest('[data-id]'), 'fadeOutLeft', { duration: 350 })
        await saveMatches(getMatches().filter((m) => m.id !== id))
        render()
      }
      return
    }

    const action = e.target.closest('[data-action]')?.dataset.action
    if (action === 'export') {
      const stamp = new Date().toISOString().slice(0, 10)
      if (await window.api.saveTextFile(`${t('history.fileName')}-${stamp}.csv`, toCsv(getMatches()), 'csv')) toast(t('history.exported'))
    }
    if (action === 'clear' && await confirmDialog(t('history.clearTitle'), t('history.clearBody'), t('history.clear'))) {
      await saveMatches([])
      render()
    }
  }

  paint({ animated: true })
  return { relocalize: () => paint() }
}
