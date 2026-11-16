// Renders the 1200 × 630 Open Graph image for each language with Electron.
// Run after changing the OG titles:  npx electron site/scripts/og.cjs
const { app, BrowserWindow } = require('electron');
const { mkdirSync, writeFileSync, mkdtempSync } = require('node:fs');
const { join } = require('node:path');
const { tmpdir } = require('node:os');
const { pathToFileURL } = require('node:url');

const site = join(__dirname, '..');
const a = (p) => pathToFileURL(join(site, 'assets', p)).href;

const html = (t) => `<!doctype html><html lang="${t.lang}"><head><meta charset="utf-8"><style>
@font-face { font-family: BC; font-weight: 700; font-style: italic; src: url(${a('fonts/barlow-condensed-latin-700-italic.woff2')}); }
@font-face { font-family: B; font-weight: 600; src: url(${a('fonts/barlow-latin-600-normal.woff2')}); }
@font-face { font-family: R; src: url(${a('fonts/racing-sans-one-latin-400-normal.woff2')}); }
html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; }
body {
  position: relative; color: #fff; font-family: B;
  background-color: #127a3d;
  background-image:
    radial-gradient(ellipse at 30% 0%, rgb(255 255 255 / .16), transparent 55%),
    radial-gradient(ellipse at center, transparent 40%, rgb(0 0 0 / .4) 100%),
    repeating-linear-gradient(90deg, #127a3d 0 100px, #168a45 100px 200px);
}
body::before { content: ""; position: absolute; inset: 0; background: url(${a('img/pitch-lines.svg')}) center / cover; }
.copy { position: absolute; left: 64px; top: 60px; width: 560px; }
.brand { display: flex; align-items: center; gap: 16px; font: 40px/1 R; }
.brand img { width: 84px; height: 84px; filter: drop-shadow(0 6px 12px rgb(0 0 0 / .35)); }
.brand span { color: #f6c343; }
h1 { margin: 40px 0 0; font: italic 700 70px/.95 BC; text-transform: uppercase; text-shadow: 0 4px 20px rgb(0 0 0 / .3); }
.tag { display: inline-block; margin-top: 34px; padding: 12px 24px; border-radius: 999px; font: italic 700 28px/1 BC; letter-spacing: .08em; text-transform: uppercase;
  background: linear-gradient(180deg, #f2493b, #e1261c 48%, #c41d14); box-shadow: 0 5px 0 #8f150e; }
.shot { position: absolute; right: -150px; top: 92px; width: 720px; padding: 14px; background: #111; border-radius: 22px;
  transform: perspective(1400px) rotateY(-14deg) rotateZ(2deg); box-shadow: 0 50px 80px -20px rgb(0 0 0 / .7); }
.shot img { display: block; width: 100%; border-radius: 8px; }
</style></head><body>
<div class="copy">
  <div class="brand"><img src="${a('icons/icon-192.png')}" alt="">Subbuteo&nbsp;<span>Scoreboard</span></div>
  <h1>${t.meta.ogTitle.split(': ').slice(1).join(': ') || t.meta.ogTitle}</h1>
  <div class="tag">${t.hero.eyebrow.split(' · ')[0]}</div>
</div>
<div class="shot"><img src="${a('img/screens/04-match.webp')}" alt=""></div>
</body></html>`;

app.disableHardwareAcceleration();
app.whenReady().then(async () => {
  const cfg = (await import(pathToFileURL(join(site, 'config.mjs')).href)).default;
  const outDir = join(site, 'assets', 'img', 'og');
  mkdirSync(outDir, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), 'og-'));
  const win = new BrowserWindow({ width: 1200, height: 630, show: false, useContentSize: true, webPreferences: { offscreen: true } });
  for (const lang of cfg.languages) {
    const t = (await import(pathToFileURL(join(site, 'i18n', `${lang}.mjs`)).href)).default;
    const file = join(tmp, `${lang}.html`);
    writeFileSync(file, html(t));
    await win.loadFile(file);
    await win.webContents.executeJavaScript('document.fonts.ready.then(() => new Promise(r => setTimeout(r, 300)))');
    const img = await win.webContents.capturePage({ x: 0, y: 0, width: 1200, height: 630 });
    writeFileSync(join(outDir, `og-${lang}.jpg`), img.resize({ width: 1200, height: 630 }).toJPEG(86));
    console.log(`og-${lang}.jpg`);
  }
  app.quit();
});
