import { confirmDialog, toast } from '../components/modal.js'
import { setBack } from '../components/topbar.js'
import { icons } from '../core/icons.js'
import { go } from '../core/router.js'
import { getMatches, saveMatches } from '../core/state.js'
import { esc, formatDate, formatTime } from '../core/utils.js'

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
        <span>${formatTime(match.date)} · 2×${match.duration}′${match.endedEarly ? ' · terminado antes' : ''}</span>
      </div>
      ${side(home, result === 'win')}
      <div class="history-row__score">${home.score}<span>–</span>${away.score}</div>
      ${side(away, result === 'loss')}
      <button class="btn-icon btn-icon--sm" type="button" data-delete title="Eliminar partido">${icons.trash}</button>
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
  const rows = standings(matches)
  return `
    <div class="panel standings">
      <table>
        <thead><tr><th>#</th><th class="text-left">Jugador</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>GF</th><th>GC</th><th>DG</th><th>Pts</th></tr></thead>
        <tbody>
          ${rows.map((r, i) => `
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
  const header = ['Fecha', 'Hora', 'Duración parte (min)', 'Equipo 1', 'Jugador 1', 'Goles 1', 'Goles 2', 'Jugador 2', 'Equipo 2', 'Terminado antes']
  const lines = matches.map((m) => [
    formatDate(m.date), formatTime(m.date), m.duration,
    m.home.teamName, m.home.player, m.home.score,
    m.away.score, m.away.player, m.away.teamName,
    m.endedEarly ? 'Sí' : 'No'
  ].map(cell).join(';'))
  return '﻿' + [header.map(cell).join(';'), ...lines].join('\n')
}

export function historyView(container) {
  setBack(() => go('home'))
  let tab = 'matches'

  container.innerHTML = `
    <section class="history">
      <div class="screen-head">
        <h1 class="screen-title">Historial de partidos</h1>
        <div class="tabs" role="tablist">
          <button class="tab" type="button" role="tab" data-tab="matches">Partidos</button>
          <button class="tab" type="button" role="tab" data-tab="standings">Clasificación</button>
        </div>
        <div class="flex gap-3">
          <button class="btn" type="button" data-action="export">${icons.download} Exportar CSV</button>
          <button class="btn" type="button" data-action="clear">${icons.trash} Borrar todo</button>
        </div>
      </div>
      <div data-content></div>
    </section>
  `
  const root = container.firstElementChild

  const render = () => {
    const matches = getMatches()
    root.querySelectorAll('[data-tab]').forEach((t) => t.setAttribute('aria-selected', t.dataset.tab === tab))
    root.querySelectorAll('[data-action]').forEach((b) => (b.disabled = !matches.length))
    const content = root.querySelector('[data-content]')

    if (!matches.length) {
      content.innerHTML = `
        <div class="panel empty-state">
          <p>Todavía no hay partidos registrados.</p>
          <button class="btn btn--lg" type="button" data-new>Nuevo partido</button>
        </div>`
      return
    }
    content.innerHTML = tab === 'matches'
      ? `<ul class="history-list">${matches.map(matchRow).join('')}</ul>`
      : standingsTable(matches)
  }

  root.addEventListener('click', async (e) => {
    const tabBtn = e.target.closest('[data-tab]')
    if (tabBtn) {
      tab = tabBtn.dataset.tab
      return render()
    }
    if (e.target.closest('[data-new]')) return go('setup')

    const del = e.target.closest('[data-delete]')
    if (del) {
      const id = del.closest('[data-id]').dataset.id
      if (await confirmDialog('Eliminar partido', 'Este partido desaparecerá del historial.', 'Eliminar')) {
        await saveMatches(getMatches().filter((m) => m.id !== id))
        render()
      }
      return
    }

    const action = e.target.closest('[data-action]')?.dataset.action
    if (action === 'export') {
      const stamp = new Date().toISOString().slice(0, 10)
      if (await window.api.saveTextFile(`subbuteo-historial-${stamp}.csv`, toCsv(getMatches()), 'csv')) toast('Historial exportado')
    }
    if (action === 'clear' && await confirmDialog('Borrar todo el historial', 'Se eliminarán todos los partidos. Esta acción no se puede deshacer.', 'Borrar todo')) {
      await saveMatches([])
      render()
    }
  })

  render()
}
