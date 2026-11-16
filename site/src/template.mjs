import { icons } from './icons.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const strip = (s) => String(s).replace(/<[^>]+>/g, '');

const HERO_SHOT = '04-match';
const SHOT_W = 1600;
const SHOT_H = 1039;

/* ---------- Shared pieces ---------- */

function head(ctx, { title, description, robots = 'index,follow', withAlternates = true }) {
  const { t, cfg, asset, pageUrl, alternates, defaultUrl, v } = ctx;
  const ogImage = `${cfg.siteUrl}/assets/img/og/og-${t.lang}.jpg`;
  const alt = withAlternates
    ? alternates.map((a) => `<link rel="alternate" hreflang="${a.lang}" href="${a.url}">`).join('\n  ') +
      `\n  <link rel="alternate" hreflang="x-default" href="${defaultUrl}">`
    : '';
  const ogAlternates = alternates
    .filter((a) => a.lang !== t.lang)
    .map((a) => `<meta property="og:locale:alternate" content="${a.locale}">`)
    .join('\n  ');

  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${robots}">
  ${withAlternates ? `<link rel="canonical" href="${pageUrl}">` : ''}
  ${alt}
  ${cfg.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(cfg.googleSiteVerification)}">` : ''}
  <meta name="author" content="${esc(cfg.author.name)}">
  <meta name="theme-color" content="#0b5c2c">
  <meta name="color-scheme" content="light">
  <meta name="format-detection" content="telephone=no">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Subbuteo Scoreboard">
  <meta property="og:title" content="${esc(t.meta.ogTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:locale" content="${t.locale}">
  ${ogAlternates}
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(t.meta.ogTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:image:alt" content="${esc(t.meta.ogAlt)}">

  <link rel="icon" href="${asset('icons/favicon-32.png')}" sizes="32x32" type="image/png">
  <link rel="icon" href="${asset('icons/icon-192.png')}" sizes="192x192" type="image/png">
  <link rel="apple-touch-icon" href="${asset('icons/apple-touch-icon.png')}">
  <link rel="manifest" href="${ctx.base}/site.webmanifest">

  <link rel="preload" href="${asset('fonts/barlow-condensed-latin-700-italic.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${asset('fonts/barlow-latin-400-normal.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${asset('styles.css')}?v=${v.css}">
  ${analytics(ctx)}
  <script type="module" src="${asset('main.js')}?v=${v.js}"></script>
</head>`;
}

function analytics({ cfg }) {
  const id = cfg.gaMeasurementId;
  if (!id) return '';
  const basic = cfg.consentMode === 'basic';
  // Consent Mode v2: everything is denied until the visitor accepts.
  return `<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.GA_ID = ${JSON.stringify(id)};
    window.GA_MODE = ${JSON.stringify(basic ? 'basic' : 'advanced')};
    var granted = false;
    try { granted = localStorage.getItem('ssb-consent') === 'granted'; } catch (e) {}
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: granted ? 'granted' : 'denied', wait_for_update: 500
    });
    gtag('set', 'ads_data_redaction', true);
    gtag('js', new Date());
    gtag('config', window.GA_ID);
    window.loadGtag = function () {
      if (window.gtagLoaded) return; window.gtagLoaded = true;
      var s = document.createElement('script'); s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_ID;
      document.head.appendChild(s);
    };
    if (window.GA_MODE === 'advanced' || granted) window.loadGtag();
  </script>`;
}

function header(ctx) {
  const { t, home } = ctx;
  const link = (id, label) => `<li><a href="#${id}">${esc(label)}</a></li>`;
  return `<header class="site-header" data-header>
  <div class="container site-header__inner">
    <a class="brand" href="${home}" aria-label="Subbuteo Scoreboard">
      <img src="${ctx.asset('icons/icon-192.png')}" alt="" width="40" height="40">
      <span class="brand__name">Subbuteo <span>Scoreboard</span></span>
    </a>
    <nav class="site-nav" aria-label="${esc(t.nav.label)}" id="site-nav" data-nav>
      <ul>
        ${link('features', t.nav.features)}
        ${link('demo', t.nav.demo)}
        ${link('gallery', t.nav.gallery)}
        ${link('install', t.nav.install)}
        ${link('faq', t.nav.faq)}
      </ul>
    </nav>
    <div class="site-header__actions">
      ${langSwitcher(ctx)}
      <a class="btn btn--red btn--sm site-header__cta" href="${ctx.cfg.downloadUrl}" data-track="download" data-track-location="header">${icons.download}<span>${esc(t.nav.download)}</span></a>
      <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
        ${icons.menu}<span class="sr-only">${esc(t.nav.menu)}</span>
      </button>
    </div>
  </div>
</header>`;
}

function langSwitcher({ t, alternates, asset }) {
  const items = alternates
    .map(
      (a) => `<li><a href="${a.path}" hreflang="${a.lang}" lang="${a.lang}" data-lang-link="${a.lang}"${a.lang === t.lang ? ' aria-current="page"' : ''}>
          <img src="${asset(`flags/${a.lang}.svg`)}" alt="" width="24" height="16">${esc(a.name)}</a></li>`
    )
    .join('\n        ');
  return `<div class="lang" data-lang>
      <button class="lang__btn" type="button" aria-expanded="false" aria-controls="lang-menu" data-lang-toggle>
        <img src="${asset(`flags/${t.lang}.svg`)}" alt="" width="24" height="16">
        <span class="lang__code">${t.lang.toUpperCase()}</span>
        <span class="sr-only">${esc(t.nav.language)}: ${esc(t.name)}</span>
        ${icons.chevron}
      </button>
      <ul class="lang__menu" id="lang-menu" hidden>
        ${items}
      </ul>
    </div>`;
}

function shot(ctx, name, { alt, eager = false, sizes = '(min-width: 1024px) 50vw, 100vw' }) {
  const src = ctx.asset(`img/screens/${name}.webp`);
  const sm = ctx.asset(`img/screens/${name}-800.webp`);
  return `<img src="${src}" srcset="${sm} 800w, ${src} 1600w" sizes="${sizes}" width="${SHOT_W}" height="${SHOT_H}" alt="${esc(alt)}"${
    eager ? ' fetchpriority="high"' : ' loading="lazy"'
  } decoding="async">`;
}

/* ---------- Sections ---------- */

function hero(ctx) {
  const { t, cfg, version } = ctx;
  return `<section class="hero pitch" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow" data-reveal>${esc(fill(t.hero.eyebrow, { version }))}</p>
      <h1 id="hero-title" class="hero__title" data-reveal>${t.hero.title}</h1>
      <p class="hero__lead" data-reveal>${esc(t.hero.lead)}</p>
      <div class="hero__ctas" data-reveal>
        <a class="btn btn--red btn--lg" href="${cfg.downloadUrl}" data-track="download" data-track-location="hero">${icons.download}<span>${esc(t.hero.ctaPrimary)}</span></a>
        <a class="btn btn--ghost btn--lg" href="${cfg.repoUrl}" data-track="github" data-track-location="hero">${icons.github}<span>${esc(t.hero.ctaSecondary)}</span></a>
      </div>
      <ul class="hero__points" data-reveal>
        ${t.hero.points.map((p) => `<li>${icons.check}${esc(p)}</li>`).join('')}
      </ul>
    </div>
    <div class="hero__visual" data-reveal>
      <div class="device">
        <div class="device__screen">${shot(ctx, HERO_SHOT, { alt: t.hero.imageAlt, eager: true, sizes: '(min-width: 1024px) 56vw, 100vw' })}</div>
        <div class="device__base" aria-hidden="true"></div>
      </div>
      <div class="chip chip--goal" aria-hidden="true">⚽ ${esc(t.hero.badgeGoal)}</div>
      <div class="chip chip--clock" aria-hidden="true">${icons.timer}<span>${esc(t.hero.badgeClock)} · 14:57</span></div>
    </div>
  </div>
</section>`;
}

function ticker({ t }) {
  const row = t.ticker.map((x) => `<li>${esc(x)}</li>`).join('');
  return `<div class="ticker" aria-hidden="true"><ul class="ticker__track">${row}${row}</ul></div>`;
}

function sectionHead(kicker, title, intro, id) {
  return `<header class="section-head" data-reveal>
      <p class="kicker">${esc(kicker)}</p>
      <h2 id="${id}">${esc(title)}</h2>
      ${intro ? `<p class="section-head__intro">${esc(intro)}</p>` : ''}
    </header>`;
}

function features({ t }) {
  const items = t.features.items
    .map(
      (f) => `<li class="feature" data-reveal>
          <span class="feature__icon">${icons[f.icon]}</span>
          <h3>${esc(f.title)}</h3>
          <p>${f.text}</p>
        </li>`
    )
    .join('\n        ');
  return `<section class="section section--cream" id="features" aria-labelledby="features-title">
  <div class="container">
    ${sectionHead(t.features.kicker, t.features.title, t.features.intro, 'features-title')}
    <ul class="features">
        ${items}
    </ul>
  </div>
</section>`;
}

function demo({ t }) {
  const d = t.demo;
  const strings = {
    start: d.start, pause: d.pause, resume: d.resume, status: d.status,
    scoreLive: d.scoreLive, home: d.home, away: d.away,
  };
  const card = (side, team) => `<div class="scorecard scorecard--${side}" data-side="${side}">
          <p class="scorecard__team">${esc(team)}</p>
          <div class="scorecard__card">
            <span class="scorecard__num" data-score>0</span>
            <button class="scorecard__hit scorecard__hit--up" type="button" data-delta="1" aria-label="${esc(fill(d.add, { team }))}"><span aria-hidden="true">+1</span></button>
            <button class="scorecard__hit scorecard__hit--down" type="button" data-delta="-1" aria-label="${esc(fill(d.remove, { team }))}"><span aria-hidden="true">−1</span></button>
          </div>
        </div>`;
  return `<section class="section pitch demo" id="demo" aria-labelledby="demo-title">
  <div class="container">
    ${sectionHead(d.kicker, d.title, d.intro, 'demo-title')}
    <div class="demo__board" data-demo data-strings="${esc(JSON.stringify(strings))}" data-reveal>
        ${card('home', d.home)}
        <div class="demo__center">
          <p class="pill">${esc(d.half)}</p>
          <p class="clock" data-clock>3:00</p>
          <p class="demo__status" data-status>${esc(d.status.idle)}</p>
          <div class="demo__controls">
            <button class="round-btn round-btn--light" type="button" data-reset aria-label="${esc(d.reset)}">${icons.reset}</button>
            <button class="round-btn round-btn--red" type="button" data-toggle aria-label="${esc(d.start)}">
              <span data-icon-play>${icons.play}</span><span data-icon-pause hidden>${icons.pause}</span>
            </button>
          </div>
        </div>
        ${card('away', d.away)}
        <div class="demo__goal" aria-hidden="true" data-goal>${esc(d.goal)}</div>
    </div>
    <p class="demo__keys" data-reveal>${d.keys}</p>
    <p class="sr-only" aria-live="polite" data-live></p>
  </div>
</section>`;
}

function how({ t }) {
  const steps = t.how.steps
    .map(
      (s, i) => `<li class="step" data-reveal>
          <span class="step__num" aria-hidden="true">${i + 1}</span>
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </li>`
    )
    .join('\n        ');
  return `<section class="section section--cream how" aria-labelledby="how-title">
  <div class="container">
    ${sectionHead(t.how.kicker, t.how.title, '', 'how-title')}
    <ol class="steps">
        ${steps}
    </ol>
  </div>
</section>`;
}

function gallery(ctx) {
  const { t } = ctx;
  const g = t.gallery;
  const items = Object.entries(g.items)
    .map(
      ([name, caption], i) => `<li data-reveal>
          <figure class="shot">
            <button type="button" class="shot__btn" data-shot="${i}" data-full="${ctx.asset(`img/screens/${name}.webp`)}" aria-label="${esc(fill(g.open, { caption }))}">
              ${shot(ctx, name, { alt: caption, sizes: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw' })}
              <span class="shot__zoom" aria-hidden="true">${icons.zoom}</span>
            </button>
            <figcaption>${esc(caption)}</figcaption>
          </figure>
        </li>`
    )
    .join('\n        ');
  return `<section class="section section--dark" id="gallery" aria-labelledby="gallery-title">
  <div class="container">
    ${sectionHead(g.kicker, g.title, '', 'gallery-title')}
    <ul class="gallery">
        ${items}
    </ul>
  </div>
  <dialog class="lightbox" data-lightbox aria-label="${esc(g.title)}">
    <figure>
      <img src="" alt="" width="${SHOT_W}" height="${SHOT_H}" data-lightbox-img>
      <figcaption data-lightbox-caption></figcaption>
    </figure>
    <button class="icon-btn lightbox__close" type="button" data-lightbox-close>${icons.close}<span class="sr-only">${esc(g.close)}</span></button>
    <button class="icon-btn lightbox__prev" type="button" data-lightbox-prev>${icons.prev}<span class="sr-only">${esc(g.prev)}</span></button>
    <button class="icon-btn lightbox__next" type="button" data-lightbox-next>${icons.next}<span class="sr-only">${esc(g.next)}</span></button>
  </dialog>
</section>`;
}

function install({ t, cfg, asset }) {
  const i = t.install;
  return `<section class="section section--cream" id="install" aria-labelledby="install-title">
  <div class="container install">
    <div class="install__copy">
      ${sectionHead(i.kicker, i.title, '', 'install-title')}
      <ol class="install__steps" data-reveal>
        ${i.steps.map((s) => `<li>${s}</li>`).join('\n        ')}
      </ol>
      <p class="install__note" data-reveal>${icons.laptop}<span>${esc(i.note)}</span></p>
      <a class="btn btn--red btn--lg" href="${cfg.downloadUrl}" data-track="download" data-track-location="install" data-reveal>${icons.download}<span>${esc(i.cta)}</span></a>
    </div>
    <div class="install__art" aria-hidden="true" data-reveal>
      <picture>
        <source srcset="${asset('img/icon-640.webp')}" type="image/webp">
        <img src="${asset('icons/icon-512.png')}" alt="" width="320" height="320" loading="lazy" decoding="async">
      </picture>
    </div>
  </div>
</section>`;
}

function faq({ t }) {
  const items = t.faq.items
    .map(
      (f) => `<details class="faq__item" data-reveal>
          <summary><h3>${esc(f.q)}</h3><span class="faq__icon" aria-hidden="true"></span></summary>
          <div class="faq__answer"><p>${f.a}</p></div>
        </details>`
    )
    .join('\n        ');
  return `<section class="section section--white" id="faq" aria-labelledby="faq-title">
  <div class="container container--narrow">
    ${sectionHead(t.faq.kicker, t.faq.title, '', 'faq-title')}
    <div class="faq">
        ${items}
    </div>
  </div>
</section>`;
}

function finalCta({ t, cfg }) {
  return `<section class="final-cta pitch" aria-labelledby="cta-title">
  <div class="container final-cta__inner" data-reveal>
    <h2 id="cta-title">${esc(t.cta.title)}</h2>
    <p>${esc(t.cta.text)}</p>
    <a class="btn btn--red btn--lg" href="${cfg.downloadUrl}" data-track="download" data-track-location="footer_cta">${icons.download}<span>${esc(t.cta.button)}</span></a>
  </div>
</section>`;
}

function footer(ctx) {
  const { t, cfg, alternates, version } = ctx;
  const f = t.footer;
  const author = `<a href="${cfg.author.url}" rel="author">${esc(cfg.author.name)}</a> · <a href="${cfg.author.url}">${esc(cfg.author.org)}</a>`;
  const heart = '<span class="heart" aria-label="♥">♥</span>';
  return `<footer class="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <a class="brand" href="${ctx.home}">
        <img src="${ctx.asset('icons/icon-192.png')}" alt="" width="40" height="40" loading="lazy">
        <span class="brand__name">Subbuteo <span>Scoreboard</span></span>
      </a>
      <p>${esc(f.tagline)}</p>
      <p>${fill(esc(f.madeBy), { heart, author })}</p>
    </div>
    <nav aria-label="${esc(f.links)}">
      <h2 class="site-footer__title">${esc(f.links)}</h2>
      <ul>
        <li><a href="${cfg.repoUrl}" data-track="github" data-track-location="footer">${esc(f.source)}</a></li>
        <li><a href="${cfg.repoUrl}/releases" data-track="github" data-track-location="footer_releases">${esc(f.releases)} · v${esc(version)}</a></li>
        <li><a href="${cfg.repoUrl}/blob/main/CREDITS.md">${esc(f.credits)}</a></li>
        ${cfg.gaMeasurementId ? `<li><button type="button" class="link-btn" data-consent-open>${esc(f.cookies)}</button></li>` : ''}
      </ul>
    </nav>
    <nav aria-label="${esc(f.languages)}">
      <h2 class="site-footer__title">${esc(f.languages)}</h2>
      <ul>
        ${alternates
          .map((a) => `<li><a href="${a.path}" hreflang="${a.lang}" lang="${a.lang}" data-lang-link="${a.lang}"${a.lang === t.lang ? ' aria-current="page"' : ''}>${esc(a.name)}</a></li>`)
          .join('\n        ')}
      </ul>
    </nav>
  </div>
  <div class="container">
    <p class="site-footer__legal">${esc(f.disclaimer)}</p>
  </div>
</footer>`;
}

function consent({ t, cfg }) {
  if (!cfg.gaMeasurementId) return '';
  const c = t.consent;
  return `<div class="consent" role="region" aria-label="${esc(c.title)}" data-consent hidden>
  <p><strong>${esc(c.title)}.</strong> ${esc(c.text)}</p>
  <div class="consent__actions">
    <button type="button" class="btn btn--ghost-dark btn--sm" data-consent-choice="denied">${esc(c.reject)}</button>
    <button type="button" class="btn btn--red btn--sm" data-consent-choice="granted">${esc(c.accept)}</button>
  </div>
</div>`;
}

function suggestBanner(ctx) {
  // Strings for every language so the banner speaks the visitor's language.
  const data = Object.fromEntries(ctx.alternates.map((a) => [a.lang, { url: a.path, ...a.suggest }]));
  return `<div class="suggest" data-suggest data-suggest-strings="${esc(JSON.stringify(data))}" hidden>
  <p data-suggest-text></p>
  <a class="btn btn--red btn--sm" data-suggest-link href="#"></a>
  <button type="button" class="icon-btn icon-btn--sm" data-suggest-dismiss>${icons.close}<span class="sr-only" data-suggest-dismiss-label></span></button>
</div>`;
}

function jsonLd(ctx) {
  const { t, cfg, pageUrl, version, defaultUrl } = ctx;
  const abs = (p) => `${cfg.siteUrl}/assets/${p}`;
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${defaultUrl}#app`,
        name: 'Subbuteo Scoreboard',
        description: t.meta.description,
        url: pageUrl,
        image: abs('icons/icon-512.png'),
        screenshot: [HERO_SHOT, ...Object.keys(t.gallery.items).slice(0, 4)].map((s) => abs(`img/screens/${s}.webp`)),
        applicationCategory: 'GameApplication',
        applicationSubCategory: 'Scoreboard',
        operatingSystem: 'macOS',
        softwareVersion: version,
        downloadUrl: cfg.downloadUrl,
        installUrl: cfg.downloadUrl,
        isAccessibleForFree: true,
        inLanguage: cfg.languages,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        author: { '@type': 'Person', name: cfg.author.name, url: cfg.author.url },
        publisher: { '@type': 'Organization', name: cfg.author.org, url: cfg.author.url },
        sameAs: [cfg.repoUrl],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: t.meta.title,
        description: t.meta.description,
        inLanguage: t.lang,
        isPartOf: { '@type': 'WebSite', '@id': `${defaultUrl}#website`, name: 'Subbuteo Scoreboard', url: defaultUrl },
        about: { '@id': `${defaultUrl}#app` },
        primaryImageOfPage: abs(`img/og/og-${t.lang}.jpg`),
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: t.lang,
        mainEntity: t.faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
        })),
      },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`;
}

/* ---------- Pages ---------- */

export function renderPage(ctx) {
  const { t } = ctx;
  return `<!doctype html>
<html lang="${t.lang}" class="no-js">
${head(ctx, { title: t.meta.title, description: t.meta.description })}
<body>
  <a class="skip-link" href="#main">${esc(t.skip)}</a>
  ${suggestBanner(ctx)}
  ${header(ctx)}
  <main id="main">
    ${hero(ctx)}
    ${ticker(ctx)}
    ${features(ctx)}
    ${demo(ctx)}
    ${how(ctx)}
    ${gallery(ctx)}
    ${install(ctx)}
    ${faq(ctx)}
    ${finalCta(ctx)}
  </main>
  ${footer(ctx)}
  ${consent(ctx)}
  ${jsonLd(ctx)}
</body>
</html>
`;
}

export function render404(ctx) {
  const { t, alternates } = ctx;
  const nf = t.notFound;
  return `<!doctype html>
<html lang="${t.lang}" class="no-js">
${head(ctx, { title: nf.metaTitle, description: nf.text, robots: 'noindex,follow', withAlternates: false })}
<body class="page-404">
  ${header(ctx)}
  <main id="main" class="not-found pitch">
    <div class="container not-found__inner">
      <p class="not-found__flag" aria-hidden="true">🚩</p>
      <h1>${esc(nf.title)}</h1>
      <p>${esc(nf.text)}</p>
      <a class="btn btn--red btn--lg" href="${ctx.home}">${esc(nf.back)}</a>
      <ul class="not-found__langs">
        ${alternates.filter((a) => a.lang !== t.lang).map((a) => `<li><a href="${a.path}" hreflang="${a.lang}" lang="${a.lang}">${esc(a.notFoundBack)}</a></li>`).join('')}
      </ul>
    </div>
  </main>
  ${consent(ctx)}
</body>
</html>
`;
}
