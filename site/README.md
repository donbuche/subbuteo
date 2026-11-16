# Landing page

Static, multilingual landing page for Subbuteo Scoreboard, published with GitHub Pages at <https://donbuche.github.io/subbuteo/>.

- English is the default language and lives at the root. Spanish, Catalan and Italian live at `/es/`, `/ca/` and `/it/`.
- Every language is a full static HTML page (no client-side translation), with its own title, description, canonical URL, `hreflang` alternates, Open Graph image and JSON-LD (`SoftwareApplication`, `WebPage`, `FAQPage`).
- No dependencies and no framework: a Node script renders `src/template.mjs` with the strings in `i18n/`.

## Commands

| Command | Description |
|---|---|
| `npm run site:dev` | Build and serve at <http://localhost:4321/subbuteo/> |
| `npm run site:build` | Build into `site/_site/` (ignored by git) |
| `npm run site:og` | Regenerate the Open Graph images (`assets/img/og/og-<lang>.jpg`) with Electron |

If `site:og` fails with `Cannot read properties of undefined (reading 'disableHardwareAcceleration')`, your terminal exports `ELECTRON_RUN_AS_NODE` (VS Code does). Run `env -u ELECTRON_RUN_AS_NODE npm run site:og`.

## Configuration

Everything that changes between environments is in [`config.mjs`](config.mjs): the public URL, the Google Analytics ID, the repository and download links, and the list of languages.

### Google Analytics

Set `gaMeasurementId` in `config.mjs`, or define a `GA_MEASUREMENT_ID` variable in **Settings → Secrets and variables → Actions → Variables**, which takes precedence in the deploy workflow.

The page uses Google Consent Mode v2 with every storage type denied until the visitor accepts the cookie banner. With `consentMode: 'advanced'` gtag loads straight away and sends cookieless pings; with `'basic'` it isn't loaded until the visitor accepts. The choice is stored in `localStorage` and can be changed from the footer link.

Custom events: `download_click`, `github_click`, `language_switch`, `language_suggestion_accept`, `demo_start`, `demo_goal`, `screenshot_open` and `faq_open`. Each one carries `page_language`.

### Custom domain

Change `siteUrl` in `config.mjs` and add a `static/CNAME` file containing the domain. Files in `static/` are copied to the site root as they are.

## Content

- Strings: `i18n/<lang>.mjs`. All files have the same keys.
- Markup: `src/template.mjs`. Styles: `src/styles.css`. Behaviour: `src/main.js`.
- Images: screenshots are WebP copies of `docs/screenshots/` at 1600 and 800 px wide.

To add a language, copy `i18n/en.mjs`, translate it, add a flag in `assets/flags/`, add the code to `languages` in `config.mjs` and run `npm run site:og`.

## Deployment

[`.github/workflows/pages.yml`](../.github/workflows/pages.yml) builds and deploys the site on every push to `main` that touches `site/` or `package.json` (the version number appears on the page). It can also be run by hand from the Actions tab. In **Settings → Pages**, the source must be **GitHub Actions**.

## SEO notes

- The page never redirects by language. It shows a small banner suggesting the visitor's browser language instead, so crawlers always see every version.
- On a project site (`user.github.io/repo`), crawlers only read `robots.txt` from the host root, so submit `sitemap.xml` in Google Search Console. A custom domain removes that limitation.
