import { animate } from '../core/animate.js'
import { el, esc } from '../core/utils.js'
import { t } from '../i18n/index.js'

// Modal genérico. `actions` = [{ label, value, variant: 'secondary' }]; resuelve con el value pulsado
// (o null si se cierra con Escape). `body` admite HTML ya escapado; los elementos
// con data-animate="efecto" (y data-delay en ms) se animan al abrir.
export function openModal({ title, body = '', actions = [{ label: t('common.accept'), value: true }], dismissable = true }) {
  return new Promise((resolve) => {
    const root = document.getElementById('modal-root')
    const modal = el(`
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal__card panel">
          <h2 class="modal__title" id="modal-title">${esc(title)}</h2>
          <div class="modal__body">${body}</div>
          <div class="modal__actions">
            ${actions.map((a, i) => `<button type="button" class="btn ${a.variant ? `btn--${a.variant}` : ''}" data-index="${i}">${esc(a.label)}</button>`).join('')}
          </div>
        </div>
      </div>
    `)

    const close = (value) => {
      document.removeEventListener('keydown', onKey, true)
      modal.classList.add('is-leaving')
      setTimeout(() => modal.remove(), 150)
      resolve(value)
    }
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissable) {
        e.stopPropagation()
        close(null)
      }
    }

    modal.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-index]')
      if (btn) close(actions[Number(btn.dataset.index)].value)
      else if (e.target === modal && dismissable) close(null)
    })
    document.addEventListener('keydown', onKey, true)
    root.append(modal)
    animate(modal.querySelector('.modal__card'), 'zoomIn', { duration: 280 })
    modal.querySelectorAll('[data-animate]').forEach((node) => animate(node, node.dataset.animate, { delay: Number(node.dataset.delay) || 0 }))
    modal.querySelector('.modal__actions .btn:last-child')?.focus()
  })
}

export async function confirmDialog(title, message, confirmLabel = t('common.accept')) {
  const result = await openModal({
    title,
    body: `<p>${esc(message)}</p>`,
    actions: [
      { label: t('common.cancel'), value: false, variant: 'secondary' },
      { label: confirmLabel, value: true }
    ]
  })
  return result === true
}

export function toast(message) {
  const node = el(`<div class="toast" role="status">${esc(message)}</div>`)
  document.body.append(node)
  animate(node, 'fadeInUp', { duration: 300 })
  setTimeout(() => animate(node, 'fadeOutDown', { duration: 300 }).then(() => node.remove()), 2300)
}
