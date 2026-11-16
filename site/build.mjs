#!/usr/bin/env node
// Builds the landing page into site/_site/. No dependencies beyond Node 20+.
//   node site/build.mjs           build
//   node site/build.mjs --serve   build and serve it at http://localhost:4321<base path>/

import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import config from './config.mjs';
import { render404, renderPage } from './src/template.mjs';

// GA_MEASUREMENT_ID in the environment (e.g. a GitHub Actions variable) overrides the config file.
const cfg = { ...config, gaMeasurementId: process.env.GA_MEASUREMENT_ID || config.gaMeasurementId };

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, '_site');
const pkg = JSON.parse(await readFile(join(root, '..', 'package.json'), 'utf8'));
const version = pkg.version;

const siteUrl = cfg.siteUrl.replace(/\/$/, '');
const base = new URL(siteUrl).pathname.replace(/\/$/, ''); // '' or '/subbuteo'
const [defaultLang] = cfg.languages;
const dict = Object.fromEntries(
  await Promise.all(cfg.languages.map(async (l) => [l, (await import(`./i18n/${l}.mjs`)).default]))
);

const prefix = (l) => (l === defaultLang ? '' : `${l}/`);
const alternates = cfg.languages.map((l) => ({
  lang: l,
  name: dict[l].name,
  locale: dict[l].locale,
  url: `${siteUrl}/${prefix(l)}`,
  path: `${base}/${prefix(l)}`,
  suggest: dict[l].suggest,
  notFoundBack: `${dict[l].name}: ${dict[l].notFound.back}`,
}));

const hash = async (f) => createHash('sha256').update(await readFile(f)).digest('hex').slice(0, 10);

async function build() {
  await rm(out, { recursive: true, force: true });
  await mkdir(join(out, 'assets'), { recursive: true });
  await cp(join(root, 'assets'), join(out, 'assets'), { recursive: true });
  await cp(join(root, 'src', 'styles.css'), join(out, 'assets', 'styles.css'));
  await cp(join(root, 'src', 'main.js'), join(out, 'assets', 'main.js'));
  if (existsSync(join(root, 'static'))) await cp(join(root, 'static'), out, { recursive: true });

  const v = { css: await hash(join(root, 'src', 'styles.css')), js: await hash(join(root, 'src', 'main.js')) };
  const asset = (p) => `${base}/assets/${p}`;
  const defaultUrl = `${siteUrl}/`;

  for (const l of cfg.languages) {
    const ctx = {
      t: dict[l], cfg, version, base, asset, alternates, defaultUrl, v,
      pageUrl: `${siteUrl}/${prefix(l)}`,
      home: `${base}/${prefix(l)}`,
    };
    const dir = join(out, prefix(l));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'index.html'), renderPage(ctx));
    if (l === defaultLang) await writeFile(join(out, '404.html'), render404(ctx));
  }

  const today = new Date().toISOString().slice(0, 10);
  const links = alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>`)
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${alternates.map((a) => `  <url>\n    <loc>${a.url}</loc>\n    <lastmod>${today}</lastmod>\n${links}\n  </url>`).join('\n')}
</urlset>
`;
  await writeFile(join(out, 'sitemap.xml'), sitemap);

  // Crawlers only read robots.txt from the host root. On a project page
  // (user.github.io/repo) this file is informative; submit the sitemap in Search Console.
  await writeFile(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);

  await writeFile(
    join(out, 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'Subbuteo Scoreboard',
        short_name: 'Scoreboard',
        start_url: `${base}/`,
        scope: `${base}/`,
        display: 'browser',
        background_color: '#0b5c2c',
        theme_color: '#0b5c2c',
        icons: [
          { src: asset('icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
          { src: asset('icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
        ],
      },
      null,
      2
    )
  );
  await writeFile(join(out, '.nojekyll'), '');

  console.log(`Built ${cfg.languages.length} languages into ${out} (v${version}, GA ${cfg.gaMeasurementId || 'disabled'})`);
}

function serve(port = 4321) {
  const types = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
    '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp',
    '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
  };
  createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (base && !path.startsWith(base)) { res.writeHead(302, { Location: `${base}/` }); return res.end(); }
    path = normalize(path.slice(base.length)).replace(/^(\.\.[/\\])+/, '');
    let file = join(out, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    const found = existsSync(file);
    if (!found) file = join(out, '404.html');
    res.writeHead(found ? 200 : 404, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  }).listen(port, () => console.log(`Serving at http://localhost:${port}${base}/`));
}

await build();
if (process.argv.includes('--serve')) serve();
