export default {
  lang: 'en',
  locale: 'en_GB',
  name: 'English',

  meta: {
    title: 'Subbuteo Scoreboard: free match scoreboard and clock for Mac',
    description:
      'Free desktop scoreboard for Subbuteo and table football: tap to score, half-time clock, whistle and crowd sounds, and the history of every match. For Mac.',
    ogTitle: 'Subbuteo Scoreboard: the scoreboard your matches deserve',
    ogAlt: 'Subbuteo Scoreboard showing a match in play: giant scores and the half-time clock',
  },

  skip: 'Skip to content',
  nav: {
    label: 'Main',
    features: 'Features',
    demo: 'Try it',
    gallery: 'Screenshots',
    install: 'Install',
    faq: 'FAQ',
    download: 'Download',
    menu: 'Menu',
    language: 'Language',
  },

  hero: {
    eyebrow: 'Free for macOS · v{version}',
    title: 'The scoreboard your <em>Subbuteo</em> matches deserve',
    lead:
      'Tap to score, run the half-time clock and keep the history of every match. A desktop app for flick-to-kick football fans, made for full screen.',
    ctaPrimary: 'Download for Mac',
    ctaSecondary: 'View on GitHub',
    points: ['No account, no ads', 'Works offline', '4 languages'],
    imageAlt: 'Subbuteo Scoreboard during a match: giant 2–1 score cards and a 14:57 half-time clock',
    badgeGoal: 'Goal!',
    badgeClock: '1st half',
  },

  ticker: ['Tap to score', 'Half-time clock', 'Referee’s whistle', 'Match history', 'Player standings', 'Your own teams', 'Stadium music', 'Full screen'],

  features: {
    kicker: 'Features',
    title: 'Everything a matchday needs. Nothing it doesn’t.',
    intro: 'Put the laptop on the side of the pitch and keep your eyes on the game. Every control is big, clear and one tap away.',
    items: [
      { icon: 'tap', title: 'Tap to score', text: 'Giant score cards: tap the top half to add a goal and the bottom half to take one away. Or use the keyboard: <kbd>Q</kbd>/<kbd>A</kbd> and <kbd>P</kbd>/<kbd>L</kbd>.' },
      { icon: 'timer', title: 'Half-time clock', text: 'A countdown for each half with pause, resume, restart-half and end-match controls. At zero it stops and waits for the second half.' },
      { icon: 'shirt', title: 'Pick your teams', text: 'Choose each side from a fish-eye carousel, type the players’ names, set the length of each half and give someone a head start.' },
      { icon: 'trophy', title: 'History and standings', text: 'Every match is saved with its date, teams, players and score. A table ranks wins, draws, losses and goal difference. Export it to CSV.' },
      { icon: 'sound', title: 'Stadium sound', text: 'A real referee’s whistle for kick-off and full time, cheering from the stands on every goal and background music in random order.' },
      { icon: 'sliders', title: 'Make it yours', text: 'Add your own teams and crests, replace the sounds, build a music playlist and choose a background photo or your own image.' },
      { icon: 'globe', title: 'Four languages', text: 'English, Castellano, Català and Italiano, switchable at any time from the flag selector, with a default language for startup.' },
      { icon: 'screen', title: 'Made for full screen', text: 'Opens full screen, keeps the display awake during a match and respects macOS Reduce motion. No internet connection needed.' },
    ],
  },

  demo: {
    kicker: 'Try it',
    title: 'Go on, score one',
    intro: 'This is how the scoreboard works. Tap the top of a card to score, the bottom to take a goal back, and start the clock.',
    home: 'Home',
    away: 'Away',
    add: 'Add a goal to {team}',
    remove: 'Take a goal from {team}',
    start: 'Kick off',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Restart',
    half: '1st half',
    status: { idle: 'Ready', running: 'In play', paused: 'Paused', over: 'Half time' },
    goal: 'Goal!',
    keys: 'Keyboard: <kbd>Q</kbd>/<kbd>A</kbd> home · <kbd>P</kbd>/<kbd>L</kbd> away · <kbd>Space</kbd> clock',
    scoreLive: '{home} {a}, {away} {b}',
  },

  how: {
    kicker: 'How it works',
    title: 'From kick-off to the final whistle',
    steps: [
      { title: 'Set up the match', text: 'Pick two teams, type the players’ names and choose how long each half lasts.' },
      { title: 'Play', text: 'The whistle blows and the clock starts. Tap to score and let the crowd do the rest.' },
      { title: 'Keep the record', text: 'At full time the result goes into the history and the player standings update themselves.' },
    ],
  },

  gallery: {
    kicker: 'Screenshots',
    title: 'Take a look around',
    open: 'Open screenshot: {caption}',
    close: 'Close',
    prev: 'Previous screenshot',
    next: 'Next screenshot',
    items: {
      '02-home': 'Home screen',
      '03-new-match': 'New match: pick teams from a fish-eye carousel',
      '05-goal': 'Goal celebration',
      '06-full-time': 'Full-time result',
      '07-history': 'Match history',
      '08-standings': 'Player standings',
      '09-settings-teams': 'Settings: teams and crests',
      '10-settings-music': 'Settings: background music',
      '11-languages': 'Language selector',
    },
  },

  install: {
    kicker: 'Install',
    title: 'Up and running in a minute',
    steps: [
      'Download the <strong>.dmg</strong> file from the latest release on GitHub and open it.',
      'Drag <strong>Subbuteo Scoreboard</strong> into your <strong>Applications</strong> folder.',
      'The first time, right-click the app and choose <strong>Open → Open</strong>. You can also allow it from <strong>System Settings → Privacy &amp; Security</strong>.',
      'Kick off. Your history and settings are kept outside the app, so they survive updates.',
    ],
    note: 'Requires macOS on Apple silicon. Developers can build it for Windows and Linux from the source code.',
    cta: 'Get the latest release',
  },

  faq: {
    kicker: 'FAQ',
    title: 'Frequently asked questions',
    items: [
      { q: 'Is Subbuteo Scoreboard free?', a: 'Yes. It’s free to download and use, with no account, no ads and no in-app purchases.' },
      { q: 'Which computers does it run on?', a: 'The ready-made installer is for Macs with Apple silicon. Windows and Linux builds are on the way, and developers can already build them from the source code on GitHub.' },
      { q: 'Does it need an internet connection?', a: 'No. Everything, including the fonts, sounds and music, is bundled with the app, so it works fully offline.' },
      { q: 'macOS says the app can’t be opened. What do I do?', a: 'The app isn’t signed with an Apple Developer certificate yet. Right-click it in Applications and choose <strong>Open → Open</strong>, or allow it from <strong>System Settings → Privacy &amp; Security</strong>. You only need to do this once.' },
      { q: 'Can I add my own teams and crests?', a: 'Yes. In <strong>Settings → Teams</strong> you can add teams, upload crests and restore the originals. A team without a crest gets one generated from its two colours.' },
      { q: 'Where are my matches stored?', a: 'In a local file on your Mac (<code>~/Library/Application Support/Subbuteo Scoreboard/</code>). Nothing is sent anywhere, and you can export the history to CSV.' },
      { q: 'Is this an official Subbuteo product?', a: 'No. It’s an unofficial app made by a fan of the game. It isn’t affiliated with or endorsed by the owners of the Subbuteo trademark.' },
    ],
  },

  cta: {
    title: 'Ready for kick-off?',
    text: 'Download Subbuteo Scoreboard and bring the stadium to your table.',
    button: 'Download for Mac',
  },

  footer: {
    tagline: 'A desktop scoreboard for Subbuteo and table football matches.',
    madeBy: 'Designed and developed with {heart} in Arenys de Munt by {author}.',
    disclaimer: 'Subbuteo is a registered trademark of its owner. This is an unofficial, fan-made app and is not affiliated with or endorsed by the trademark owner. Team crests shown in the screenshots belong to their respective clubs and federations.',
    links: 'Links',
    source: 'Source code',
    releases: 'Releases',
    credits: 'Credits',
    cookies: 'Cookie settings',
    languages: 'Languages',
  },

  consent: {
    title: 'Cookies',
    text: 'We use Google Analytics cookies to count visits and see which parts of this page are useful. They’re only set if you accept.',
    accept: 'Accept',
    reject: 'Reject',
  },

  suggest: {
    text: 'This page is also available in English.',
    cta: 'Switch to English',
    dismiss: 'Dismiss',
  },

  notFound: {
    title: 'Offside!',
    text: 'The page you’re looking for isn’t on the pitch. It may have moved or never existed.',
    back: 'Back to the home page',
    metaTitle: 'Page not found · Subbuteo Scoreboard',
  },
};
