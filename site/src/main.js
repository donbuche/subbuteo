// Subbuteo Scoreboard landing page. Vanilla JS, no dependencies.

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const pageLang = document.documentElement.lang;

document.documentElement.classList.replace('no-js', 'js');

/* ---------- Analytics ---------- */

function track(name, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', name, { page_language: pageLang, ...params });
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-track]');
  if (!el) return;
  const kind = el.dataset.track;
  const location = el.dataset.trackLocation;
  if (kind === 'download') track('download_click', { link_url: el.href, location });
  if (kind === 'github') track('github_click', { link_url: el.href, location });
});

/* ---------- Consent (Google Consent Mode v2) ---------- */

const consent = $('[data-consent]');
function setConsent(value) {
  store.set('ssb-consent', value);
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: value });
    if (value === 'granted' && window.loadGtag) window.loadGtag();
  }
  if (consent) consent.hidden = true;
  maybeSuggestLanguage();
}
if (consent) {
  if (!store.get('ssb-consent')) consent.hidden = false;
  $$('[data-consent-choice]', consent).forEach((b) =>
    b.addEventListener('click', () => setConsent(b.dataset.consentChoice))
  );
  $$('[data-consent-open]').forEach((b) =>
    b.addEventListener('click', () => {
      consent.hidden = false;
      $('[data-consent-choice="granted"]', consent).focus();
    })
  );
}

/* ---------- Header: scrolled state and mobile menu ---------- */

const header = $('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const nav = $('[data-nav]');
const navToggle = $('[data-nav-toggle]');
function setNav(open) {
  nav?.classList.toggle('is-open', open);
  navToggle?.setAttribute('aria-expanded', String(open));
  if (open) header?.classList.add('is-scrolled');
  else onScroll();
}
navToggle?.addEventListener('click', () => setNav(navToggle.getAttribute('aria-expanded') !== 'true'));
nav?.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });

/* ---------- Language switcher ---------- */

const langToggle = $('[data-lang-toggle]');
const langMenu = $('#lang-menu');
function setLangMenu(open) {
  if (!langMenu) return;
  langMenu.hidden = !open;
  langToggle.setAttribute('aria-expanded', String(open));
}
langToggle?.addEventListener('click', (e) => {
  e.stopPropagation();
  setLangMenu(langMenu.hidden);
  if (!langMenu.hidden) $('a', langMenu)?.focus();
});
document.addEventListener('click', (e) => { if (!e.target.closest('[data-lang]')) setLangMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (langMenu && !langMenu.hidden) { setLangMenu(false); langToggle.focus(); }
  if (nav?.classList.contains('is-open')) { setNav(false); navToggle.focus(); }
});
$$('[data-lang-link]').forEach((a) =>
  a.addEventListener('click', () => {
    store.set('ssb-lang', a.dataset.langLink);
    if (a.dataset.langLink !== pageLang) track('language_switch', { from: pageLang, to: a.dataset.langLink });
  })
);

/* ---------- Suggest the visitor's language (never redirect) ---------- */

function maybeSuggestLanguage() {
  const box = $('[data-suggest]');
  if (!box || store.get('ssb-lang') || store.get('ssb-suggest-dismissed')) return;
  if (consent && !consent.hidden) return; // one banner at a time
  const strings = JSON.parse(box.dataset.suggestStrings);
  const preferred = (navigator.languages || [navigator.language])
    .map((l) => String(l).toLowerCase().split('-')[0])
    .find((l) => l in strings);
  if (!preferred || preferred === pageLang) return;
  const s = strings[preferred];
  const text = $('[data-suggest-text]', box);
  const link = $('[data-suggest-link]', box);
  text.textContent = s.text;
  text.lang = preferred;
  link.textContent = s.cta;
  link.lang = preferred;
  link.href = s.url;
  link.hreflang = preferred;
  $('[data-suggest-dismiss-label]', box).textContent = s.dismiss;
  box.hidden = false;
  link.addEventListener('click', () => {
    store.set('ssb-lang', preferred);
    track('language_suggestion_accept', { from: pageLang, to: preferred });
  });
  $('[data-suggest-dismiss]', box).addEventListener('click', () => {
    store.set('ssb-suggest-dismissed', '1');
    box.hidden = true;
  });
}
maybeSuggestLanguage();

/* ---------- Reveal on scroll ---------- */

const revealables = $$('[data-reveal]');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealables.forEach((el) => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-visible');
      io.unobserve(en.target);
    }),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  revealables.forEach((el, i) => {
    // Stagger siblings inside the same list for a cascading entrance.
    const idx = [...el.parentElement.children].indexOf(el);
    el.style.transitionDelay = `${Math.min(idx, 6) * 70}ms`;
    io.observe(el);
  });
}

/* ---------- Interactive scoreboard demo ---------- */

const board = $('[data-demo]');
if (board) {
  const S = JSON.parse(board.dataset.strings);
  const HALF = 180; // seconds
  const state = { home: 0, away: 0, left: HALF, running: false, timer: null, started: false };
  const clock = $('[data-clock]', board);
  const status = $('[data-status]', board);
  const toggle = $('[data-toggle]', board);
  const live = $('[data-live]');
  const goalEl = $('[data-goal]', board);
  let goalTimer;

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const setStatus = (k) => { status.textContent = S.status[k]; };
  const announce = () => {
    live.textContent = S.scoreLive
      .replace('{home}', S.home).replace('{away}', S.away)
      .replace('{a}', state.home).replace('{b}', state.away);
  };

  function score(side, delta) {
    const next = Math.max(0, Math.min(99, state[side] + delta));
    if (next === state[side]) return;
    state[side] = next;
    const num = $(`[data-side="${side}"] [data-score]`, board);
    num.textContent = next;
    num.classList.remove('is-bump'); void num.offsetWidth; num.classList.add('is-bump');
    announce();
    if (delta > 0) {
      goalEl.classList.remove('is-on'); void goalEl.offsetWidth; goalEl.classList.add('is-on');
      clearTimeout(goalTimer);
      goalTimer = setTimeout(() => goalEl.classList.remove('is-on'), 1500);
      track('demo_goal', { side });
    }
  }

  function render() {
    clock.textContent = fmt(state.left);
    $('[data-icon-play]', toggle).hidden = state.running;
    $('[data-icon-pause]', toggle).hidden = !state.running;
    toggle.setAttribute('aria-label', state.running ? S.pause : state.started ? S.resume : S.start);
  }

  function tick() {
    state.left -= 1;
    if (state.left <= 0) {
      state.left = 0;
      stop();
      setStatus('over');
    }
    render();
  }
  function start() {
    if (state.left === 0) return;
    state.running = true;
    if (!state.started) track('demo_start');
    state.started = true;
    state.timer = setInterval(tick, 1000);
    setStatus('running');
    render();
  }
  function stop() {
    state.running = false;
    clearInterval(state.timer);
  }
  function toggleClock() {
    if (state.running) { stop(); setStatus('paused'); render(); } else start();
  }
  function reset() {
    stop();
    Object.assign(state, { home: 0, away: 0, left: HALF, started: false });
    $$('[data-score]', board).forEach((n) => { n.textContent = '0'; });
    setStatus('idle');
    render();
    announce();
  }

  $$('[data-delta]', board).forEach((b) =>
    b.addEventListener('click', () => score(b.closest('[data-side]').dataset.side, Number(b.dataset.delta)))
  );
  toggle.addEventListener('click', toggleClock);
  $('[data-reset]', board).addEventListener('click', reset);

  // Keyboard shortcuts while the demo is on screen, like the app (Q/A, P/L, Space).
  let demoVisible = false;
  new IntersectionObserver(([en]) => { demoVisible = en.intersectionRatio > 0.5; }, { threshold: [0, 0.5, 1] }).observe(board);
  document.addEventListener('keydown', (e) => {
    if (!demoVisible || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable], dialog[open]')) return;
    const k = e.key.toLowerCase();
    const map = { q: ['home', 1], a: ['home', -1], p: ['away', 1], l: ['away', -1] };
    if (map[k]) { e.preventDefault(); score(...map[k]); }
    else if (e.code === 'Space' && !e.target.closest('button, a, summary')) { e.preventDefault(); toggleClock(); }
  });

  render();
}

/* ---------- Screenshot lightbox ---------- */

const lightbox = $('[data-lightbox]');
if (lightbox && typeof lightbox.showModal === 'function') {
  const shots = $$('[data-shot]');
  const img = $('[data-lightbox-img]', lightbox);
  const cap = $('[data-lightbox-caption]', lightbox);
  let current = 0;
  let opener = null;

  const show = (i) => {
    current = (i + shots.length) % shots.length;
    const btn = shots[current];
    const caption = btn.closest('figure').querySelector('figcaption').textContent;
    img.src = btn.dataset.full;
    img.alt = caption;
    cap.textContent = caption;
  };

  shots.forEach((btn, i) =>
    btn.addEventListener('click', () => {
      opener = btn;
      show(i);
      lightbox.showModal();
      track('screenshot_open', { screenshot: btn.dataset.full.split('/').pop() });
    })
  );
  $('[data-lightbox-close]', lightbox).addEventListener('click', () => lightbox.close());
  $('[data-lightbox-prev]', lightbox).addEventListener('click', () => show(current - 1));
  $('[data-lightbox-next]', lightbox).addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  lightbox.addEventListener('close', () => opener?.focus());
}

/* ---------- FAQ engagement ---------- */

$$('.faq__item').forEach((d) =>
  d.addEventListener('toggle', () => {
    if (d.open) track('faq_open', { question: $('h3', d).textContent });
  })
);
