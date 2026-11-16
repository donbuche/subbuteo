// Central configuration for the Subbuteo Scoreboard landing page.
// Everything that changes between environments lives here.

export default {
  // Public URL of the site, without a trailing slash. If you move the site to a
  // custom domain, change this line and add a CNAME file in site/static/.
  siteUrl: 'https://donbuche.github.io/subbuteo',

  // Google Analytics 4 measurement ID (G-XXXXXXXXXX). Leave empty to disable GA.
  gaMeasurementId: 'G-LH2G93NPZ2',

  // Consent Mode v2: 'advanced' loads gtag straight away with every storage
  // type denied (cookieless pings) until the visitor accepts. 'basic' doesn't
  // load gtag at all until the visitor accepts.
  consentMode: 'advanced',

  // Content of the google-site-verification meta tag for Search Console (optional).
  googleSiteVerification: '',

  repoUrl: 'https://github.com/donbuche/subbuteo',
  downloadUrl: 'https://github.com/donbuche/subbuteo/releases/latest',

  author: {
    name: 'Joan Galtés i Moreno',
    url: 'https://arianewebdesign.com',
    org: 'Ariane webdesign',
  },

  // First entry is the default language, served from the site root.
  languages: ['en', 'es', 'ca', 'it'],
};
