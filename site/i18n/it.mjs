export default {
  lang: 'it',
  locale: 'it_IT',
  name: 'Italiano',

  meta: {
    title: 'Subbuteo Scoreboard: segnapunti e cronometro gratis per Mac',
    description:
      'Segnapunti gratuito per partite di Subbuteo e calcio da tavolo: tocca per segnare, cronometro per tempi, fischio e tifo, e lo storico di ogni partita. Per Mac.',
    ogTitle: 'Subbuteo Scoreboard: il segnapunti che le tue partite meritano',
    ogAlt: 'Subbuteo Scoreboard durante una partita: punteggi giganti e il cronometro del primo tempo',
  },

  skip: 'Vai al contenuto',
  nav: {
    label: 'Principale',
    features: 'Funzioni',
    demo: 'Provalo',
    gallery: 'Schermate',
    install: 'Installazione',
    faq: 'Domande',
    download: 'Scarica',
    menu: 'Menu',
    language: 'Lingua',
  },

  hero: {
    eyebrow: 'Gratis per macOS · v{version}',
    title: 'Il segnapunti che le tue partite di <em>Subbuteo</em> meritano',
    lead:
      'Tocca per segnare, gestisci il cronometro di ogni tempo e conserva lo storico di tutte le partite. Un’app desktop per gli appassionati del calcio in punta di dito, pensata per lo schermo intero.',
    ctaPrimary: 'Scarica per Mac',
    ctaSecondary: 'Vedi su GitHub',
    points: ['Niente account né pubblicità', 'Funziona offline', '4 lingue'],
    imageAlt: 'Subbuteo Scoreboard durante una partita: punteggi giganti 2–1 e il cronometro a 14:57',
    badgeGoal: 'Gol!',
    badgeClock: '1º tempo',
  },

  ticker: ['Tocca per segnare', 'Cronometro per tempi', 'Fischio dell’arbitro', 'Storico partite', 'Classifica giocatori', 'Le tue squadre', 'Musica da stadio', 'Schermo intero'],

  features: {
    kicker: 'Funzioni',
    title: 'Tutto ciò che serve in un giorno di partita. Niente di superfluo.',
    intro: 'Appoggia il portatile a bordo campo e tieni gli occhi sul gioco. Ogni comando è grande, chiaro e a portata di tocco.',
    items: [
      { icon: 'tap', title: 'Tocca per segnare', text: 'Punteggi giganti: tocca la metà superiore per aggiungere un gol e quella inferiore per toglierlo. Oppure usa la tastiera: <kbd>Q</kbd>/<kbd>A</kbd> e <kbd>P</kbd>/<kbd>L</kbd>.' },
      { icon: 'timer', title: 'Cronometro per tempi', text: 'Un conto alla rovescia per ogni tempo, con pausa, ripresa, riavvio del tempo e fine partita. A zero si ferma e aspetta il secondo tempo.' },
      { icon: 'shirt', title: 'Scegli le squadre', text: 'Scegli ogni squadra da un carosello con effetto fish-eye, scrivi i nomi dei giocatori, imposta la durata di ogni tempo e dai un vantaggio a chi vuoi.' },
      { icon: 'trophy', title: 'Storico e classifica', text: 'Ogni partita viene salvata con data, squadre, giocatori e risultato. Una tabella ordina vittorie, pareggi, sconfitte e differenza reti. Esportala in CSV.' },
      { icon: 'sound', title: 'Suono da stadio', text: 'Un vero fischio d’arbitro per il calcio d’inizio e il triplice fischio, il tifo degli spalti a ogni gol e musica di sottofondo in ordine casuale.' },
      { icon: 'sliders', title: 'Come piace a te', text: 'Aggiungi le tue squadre e i tuoi stemmi, sostituisci i suoni, crea una playlist e scegli una foto di sfondo o un’immagine tua.' },
      { icon: 'globe', title: 'Quattro lingue', text: 'Italiano, English, Castellano e Català, da cambiare in qualsiasi momento dal selettore con le bandiere, con una lingua predefinita all’avvio.' },
      { icon: 'screen', title: 'Pensata per lo schermo intero', text: 'Si apre a schermo intero, tiene acceso lo schermo durante la partita e rispetta l’opzione Riduci movimento di macOS. Non serve internet.' },
    ],
  },

  demo: {
    kicker: 'Provalo',
    title: 'Dai, segnane uno',
    intro: 'Ecco come funziona il segnapunti. Tocca la parte alta di una carta per segnare, quella bassa per annullare un gol, e avvia il cronometro.',
    home: 'Casa',
    away: 'Ospiti',
    add: 'Aggiungi un gol a {team}',
    remove: 'Togli un gol a {team}',
    start: 'Calcio d’inizio',
    pause: 'Pausa',
    resume: 'Riprendi',
    reset: 'Ricomincia',
    half: '1º tempo',
    status: { idle: 'Pronti', running: 'In gioco', paused: 'In pausa', over: 'Intervallo' },
    goal: 'Gol!',
    keys: 'Tastiera: <kbd>Q</kbd>/<kbd>A</kbd> casa · <kbd>P</kbd>/<kbd>L</kbd> ospiti · <kbd>Spazio</kbd> cronometro',
    scoreLive: '{home} {a}, {away} {b}',
  },

  how: {
    kicker: 'Come funziona',
    title: 'Dal calcio d’inizio al triplice fischio',
    steps: [
      { title: 'Prepara la partita', text: 'Scegli due squadre, scrivi i nomi dei giocatori e decidi quanto dura ogni tempo.' },
      { title: 'Gioca', text: 'L’arbitro fischia e parte il cronometro. Tocca per segnare e lascia che il pubblico faccia il resto.' },
      { title: 'Conserva il risultato', text: 'A fine partita il risultato finisce nello storico e la classifica dei giocatori si aggiorna da sola.' },
    ],
  },

  gallery: {
    kicker: 'Schermate',
    title: 'Dai un’occhiata',
    open: 'Apri la schermata: {caption}',
    close: 'Chiudi',
    prev: 'Schermata precedente',
    next: 'Schermata successiva',
    items: {
      '02-home': 'Schermata iniziale',
      '03-new-match': 'Nuova partita: scegli le squadre dal carosello',
      '05-goal': 'Esultanza per un gol',
      '06-full-time': 'Risultato finale',
      '07-history': 'Storico delle partite',
      '08-standings': 'Classifica dei giocatori',
      '09-settings-teams': 'Impostazioni: squadre e stemmi',
      '10-settings-music': 'Impostazioni: musica di sottofondo',
      '11-languages': 'Selettore della lingua',
    },
  },

  install: {
    kicker: 'Installazione',
    title: 'Pronto in un minuto',
    steps: [
      'Scarica il file <strong>.dmg</strong> dell’ultima versione su GitHub e aprilo.',
      'Trascina <strong>Subbuteo Scoreboard</strong> nella cartella <strong>Applicazioni</strong>.',
      'La prima volta, fai clic destro sull’app e scegli <strong>Apri → Apri</strong>. Puoi anche consentirla da <strong>Impostazioni di Sistema → Privacy e sicurezza</strong>.',
      'Si gioca! Lo storico e le impostazioni sono salvati fuori dall’app, quindi restano anche dopo gli aggiornamenti.',
    ],
    note: 'Richiede macOS su un Mac con Apple silicon. Gli sviluppatori possono compilarla per Windows e Linux a partire dal codice sorgente.',
    cta: 'Scarica l’ultima versione',
  },

  faq: {
    kicker: 'Domande',
    title: 'Domande frequenti',
    items: [
      { q: 'Subbuteo Scoreboard è gratuito?', a: 'Sì. Si scarica e si usa gratis, senza account, senza pubblicità e senza acquisti in-app.' },
      { q: 'Su quali computer funziona?', a: 'Il programma di installazione è pronto per i Mac con Apple silicon. Le versioni per Windows e Linux sono in arrivo, e gli sviluppatori possono già compilarle dal codice sorgente su GitHub.' },
      { q: 'Serve una connessione a internet?', a: 'No. Tutto, compresi i font, i suoni e la musica, è incluso nell’app, quindi funziona completamente offline.' },
      { q: 'macOS dice che l’app non si può aprire. Cosa faccio?', a: 'L’app non è ancora firmata con un certificato Apple Developer. Fai clic destro su di essa in Applicazioni e scegli <strong>Apri → Apri</strong>, oppure consentila da <strong>Impostazioni di Sistema → Privacy e sicurezza</strong>. Basta farlo la prima volta.' },
      { q: 'Posso aggiungere le mie squadre e i miei stemmi?', a: 'Sì. In <strong>Impostazioni → Squadre</strong> puoi aggiungere squadre, caricare stemmi e ripristinare gli originali. Una squadra senza stemma ne riceve uno generato con i suoi due colori.' },
      { q: 'Dove vengono salvate le mie partite?', a: 'In un file locale sul tuo Mac (<code>~/Library/Application Support/Subbuteo Scoreboard/</code>). Non viene inviato nulla e puoi esportare lo storico in CSV.' },
      { q: 'È un prodotto ufficiale Subbuteo?', a: 'No. È un’app non ufficiale creata da un appassionato del gioco. Non è affiliata né approvata dai titolari del marchio Subbuteo.' },
    ],
  },

  cta: {
    title: 'Pronti per il calcio d’inizio?',
    text: 'Scarica Subbuteo Scoreboard e porta lo stadio sul tuo tavolo.',
    button: 'Scarica per Mac',
  },

  footer: {
    tagline: 'Un segnapunti desktop per partite di Subbuteo e calcio da tavolo.',
    madeBy: 'Progettato e sviluppato con {heart} ad Arenys de Munt da {author}.',
    disclaimer: 'Subbuteo è un marchio registrato del rispettivo titolare. Questa è un’app non ufficiale creata da un appassionato e non è affiliata né approvata dal titolare del marchio. Gli stemmi mostrati nelle schermate appartengono ai rispettivi club e federazioni.',
    links: 'Link',
    source: 'Codice sorgente',
    releases: 'Versioni',
    credits: 'Crediti',
    cookies: 'Impostazioni dei cookie',
    languages: 'Lingue',
  },

  consent: {
    title: 'Cookie',
    text: 'Usiamo i cookie di Google Analytics per contare le visite e capire quali parti di questa pagina sono utili. Vengono installati solo se accetti.',
    accept: 'Accetta',
    reject: 'Rifiuta',
  },

  suggest: {
    text: 'Questa pagina è disponibile anche in italiano.',
    cta: 'Vai alla versione italiana',
    dismiss: 'Chiudi',
  },

  notFound: {
    title: 'Fuorigioco!',
    text: 'La pagina che cerchi non è in campo. Forse è stata spostata o non è mai esistita.',
    back: 'Torna alla pagina iniziale',
    metaTitle: 'Pagina non trovata · Subbuteo Scoreboard',
  },
};
