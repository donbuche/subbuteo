export default {
  lang: 'ca',
  locale: 'ca_ES',
  name: 'Català',

  meta: {
    title: 'Subbuteo Scoreboard: marcador i rellotge gratis per a Mac',
    description:
      'Marcador gratuït per a partits de Subbuteo i futbol de taula: toca per marcar, rellotge per parts, xiulet i públic, i historial de cada partit. Per a Mac.',
    ogTitle: 'Subbuteo Scoreboard: el marcador que els teus partits es mereixen',
    ogAlt: 'Subbuteo Scoreboard durant un partit: marcadors gegants i el rellotge de la primera part',
  },

  skip: 'Salta al contingut',
  nav: {
    label: 'Principal',
    features: 'Funcions',
    demo: 'Prova-ho',
    gallery: 'Captures',
    install: 'Instal·lació',
    faq: 'Preguntes',
    download: 'Descarrega',
    menu: 'Menú',
    language: 'Idioma',
  },

  hero: {
    eyebrow: 'Gratuït per a macOS · v{version}',
    title: 'El marcador que els teus partits de <em>Subbuteo</em> es mereixen',
    lead:
      'Toca per marcar, controla el rellotge de cada part i desa l’historial de tots els partits. Una app d’escriptori per als amants del futbol de taula, pensada per a pantalla completa.',
    ctaPrimary: 'Descarrega per a Mac',
    ctaSecondary: 'Mira-la a GitHub',
    points: ['Sense comptes ni anuncis', 'Funciona sense connexió', '4 idiomes'],
    imageAlt: 'Subbuteo Scoreboard durant un partit: marcadors gegants 2–1 i el rellotge a 14:57',
    badgeGoal: 'Gol!',
    badgeClock: '1a part',
  },

  ticker: ['Toca per marcar', 'Rellotge per parts', 'Xiulet de l’àrbitre', 'Historial de partits', 'Classificació de jugadors', 'Els teus equips', 'Música d’estadi', 'Pantalla completa'],

  features: {
    kicker: 'Funcions',
    title: 'Tot el que demana un dia de partit. Res que sobri.',
    intro: 'Deixa el portàtil al costat del camp i no perdis de vista el joc. Cada control és gran, clar i a un toc de distància.',
    items: [
      { icon: 'tap', title: 'Toca per marcar', text: 'Marcadors gegants: toca la meitat superior per sumar un gol i la inferior per restar-lo. O fes servir el teclat: <kbd>Q</kbd>/<kbd>A</kbd> i <kbd>P</kbd>/<kbd>L</kbd>.' },
      { icon: 'timer', title: 'Rellotge per parts', text: 'Un compte enrere per a cada part, amb pausa, represa, reinici de la part i final del partit. Quan arriba a zero s’atura i espera la segona part.' },
      { icon: 'shirt', title: 'Tria els equips', text: 'Escull cada equip en un carrusel amb efecte ull de peix, escriu el nom dels jugadors, fixa la durada de cada part i dona avantatge a qui vulguis.' },
      { icon: 'trophy', title: 'Historial i classificació', text: 'Cada partit es desa amb la data, els equips, els jugadors i el resultat. Una taula ordena victòries, empats, derrotes i diferència de gols. Exporta-ho a CSV.' },
      { icon: 'sound', title: 'So d’estadi', text: 'Un xiulet d’àrbitre de debò per al xut inicial i el final, el públic celebrant cada gol i música de fons en ordre aleatori.' },
      { icon: 'sliders', title: 'Al teu gust', text: 'Afegeix els teus equips i escuts, canvia els sons, crea una llista de música i tria una foto de fons o una imatge pròpia.' },
      { icon: 'globe', title: 'Quatre idiomes', text: 'Català, Castellano, English i Italiano, canviables en qualsevol moment des del selector de banderes, amb un idioma per defecte en iniciar.' },
      { icon: 'screen', title: 'Pensada per a pantalla completa', text: 'S’obre a pantalla completa, manté la pantalla encesa durant el partit i respecta l’opció Reduir el moviment de macOS. No necessita internet.' },
    ],
  },

  demo: {
    kicker: 'Prova-ho',
    title: 'Au, marca’n un',
    intro: 'Així funciona el marcador. Toca la part de dalt d’una targeta per marcar, la de baix per anul·lar un gol, i engega el rellotge.',
    home: 'Local',
    away: 'Visitant',
    add: 'Suma un gol a {team}',
    remove: 'Resta un gol a {team}',
    start: 'Xut inicial',
    pause: 'Pausa',
    resume: 'Reprèn',
    reset: 'Reinicia',
    half: '1a part',
    status: { idle: 'Preparats', running: 'En joc', paused: 'En pausa', over: 'Descans' },
    goal: 'Gol!',
    keys: 'Teclat: <kbd>Q</kbd>/<kbd>A</kbd> local · <kbd>P</kbd>/<kbd>L</kbd> visitant · <kbd>Espai</kbd> rellotge',
    scoreLive: '{home} {a}, {away} {b}',
  },

  how: {
    kicker: 'Com funciona',
    title: 'Del xut inicial al xiulet final',
    steps: [
      { title: 'Prepara el partit', text: 'Tria dos equips, escriu el nom dels jugadors i decideix quant dura cada part.' },
      { title: 'Juga', text: 'Sona el xiulet i arrenca el rellotge. Toca per marcar i deixa que el públic faci la resta.' },
      { title: 'Desa el resultat', text: 'En acabar el partit, el resultat passa a l’historial i la classificació de jugadors s’actualitza sola.' },
    ],
  },

  gallery: {
    kicker: 'Captures',
    title: 'Fes-hi una ullada',
    open: 'Obre la captura: {caption}',
    close: 'Tanca',
    prev: 'Captura anterior',
    next: 'Captura següent',
    items: {
      '02-home': 'Pantalla d’inici',
      '03-new-match': 'Nou partit: tria els equips al carrusel',
      '05-goal': 'Celebració d’un gol',
      '06-full-time': 'Resultat final',
      '07-history': 'Historial de partits',
      '08-standings': 'Classificació de jugadors',
      '09-settings-teams': 'Configuració: equips i escuts',
      '10-settings-music': 'Configuració: música de fons',
      '11-languages': 'Selector d’idioma',
    },
  },

  install: {
    kicker: 'Instal·lació',
    title: 'A punt en un minut',
    steps: [
      'Descarrega el fitxer <strong>.dmg</strong> de l’última versió a GitHub i obre’l.',
      'Arrossega <strong>Subbuteo Scoreboard</strong> a la carpeta <strong>Aplicacions</strong>.',
      'La primera vegada, fes clic dret a l’app i tria <strong>Obre → Obre</strong>. També la pots permetre des de <strong>Configuració del Sistema → Privadesa i seguretat</strong>.',
      'A jugar! L’historial i la configuració es desen fora de l’app, així que es conserven quan l’actualitzes.',
    ],
    note: 'Requereix macOS en un Mac amb Apple silicon. Els desenvolupadors la poden compilar per a Windows i Linux a partir del codi font.',
    cta: 'Descarrega l’última versió',
  },

  faq: {
    kicker: 'Preguntes',
    title: 'Preguntes freqüents',
    items: [
      { q: 'Subbuteo Scoreboard és gratuït?', a: 'Sí. Es descarrega i es fa servir de franc, sense comptes, sense anuncis i sense compres dins l’app.' },
      { q: 'En quins ordinadors funciona?', a: 'L’instal·lador està preparat per a Mac amb Apple silicon. Les versions per a Windows i Linux són en camí, i els desenvolupadors ja les poden compilar des del codi font a GitHub.' },
      { q: 'Necessita connexió a internet?', a: 'No. Tot, incloses les fonts, els sons i la música, ve dins l’app, així que funciona completament sense connexió.' },
      { q: 'El macOS diu que l’app no es pot obrir. Què faig?', a: 'L’app encara no està signada amb un certificat d’Apple Developer. Fes-hi clic dret a Aplicacions i tria <strong>Obre → Obre</strong>, o permet-la des de <strong>Configuració del Sistema → Privadesa i seguretat</strong>. Només cal fer-ho la primera vegada.' },
      { q: 'Puc afegir els meus equips i escuts?', a: 'Sí. A <strong>Configuració → Equips</strong> pots afegir equips, pujar escuts i recuperar els originals. Un equip sense escut en rep un de generat amb els seus dos colors.' },
      { q: 'On es desen els meus partits?', a: 'En un fitxer local del teu Mac (<code>~/Library/Application Support/Subbuteo Scoreboard/</code>). No s’envia res enlloc i pots exportar l’historial a CSV.' },
      { q: 'És un producte oficial de Subbuteo?', a: 'No. És una app no oficial feta per un aficionat al joc. No està afiliada ni avalada pels titulars de la marca Subbuteo.' },
    ],
  },

  cta: {
    title: 'Preparats per al xut inicial?',
    text: 'Descarrega Subbuteo Scoreboard i porta l’estadi a la teva taula.',
    button: 'Descarrega per a Mac',
  },

  footer: {
    tagline: 'Un marcador d’escriptori per a partits de Subbuteo i futbol de taula.',
    madeBy: 'Dissenyat i desenvolupat amb {heart} a Arenys de Munt per {author}.',
    disclaimer: 'Subbuteo és una marca registrada del seu titular. Aquesta és una app no oficial creada per un aficionat i no està afiliada ni avalada pel titular de la marca. Els escuts que apareixen a les captures pertanyen als seus respectius clubs i federacions.',
    links: 'Enllaços',
    source: 'Codi font',
    releases: 'Versions',
    credits: 'Crèdits',
    cookies: 'Configuració de galetes',
    languages: 'Idiomes',
  },

  consent: {
    title: 'Galetes',
    text: 'Fem servir galetes de Google Analytics per comptar les visites i saber quines parts d’aquesta pàgina són útils. Només s’instal·len si les acceptes.',
    accept: 'Accepta',
    reject: 'Rebutja',
  },

  suggest: {
    text: 'Aquesta pàgina també està disponible en català.',
    cta: 'Mira-la en català',
    dismiss: 'Tanca',
  },

  notFound: {
    title: 'Fora de joc!',
    text: 'La pàgina que busques no és al camp. Potser s’ha mogut o no ha existit mai.',
    back: 'Torna a la pàgina d’inici',
    metaTitle: 'Pàgina no trobada · Subbuteo Scoreboard',
  },
};
