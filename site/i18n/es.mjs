export default {
  lang: 'es',
  locale: 'es_ES',
  name: 'Español',

  meta: {
    title: 'Subbuteo Scoreboard: marcador y reloj gratis para Mac',
    description:
      'Marcador gratuito para partidos de Subbuteo y fútbol de mesa: toca para marcar, reloj por partes, silbato y público, e historial de cada partido. Para Mac.',
    ogTitle: 'Subbuteo Scoreboard: el marcador que tus partidos merecen',
    ogAlt: 'Subbuteo Scoreboard durante un partido: marcadores gigantes y el reloj de la primera parte',
  },

  skip: 'Saltar al contenido',
  nav: {
    label: 'Principal',
    features: 'Funciones',
    demo: 'Pruébalo',
    gallery: 'Capturas',
    install: 'Instalación',
    faq: 'Preguntas',
    download: 'Descargar',
    menu: 'Menú',
    language: 'Idioma',
  },

  hero: {
    eyebrow: 'Gratis para macOS · v{version}',
    title: 'El marcador que tus partidos de <em>Subbuteo</em> merecen',
    lead:
      'Toca para marcar, controla el reloj de cada parte y guarda el historial de todos los partidos. Una app de escritorio para los amantes del fútbol de mesa, pensada para pantalla completa.',
    ctaPrimary: 'Descargar para Mac',
    ctaSecondary: 'Ver en GitHub',
    points: ['Sin cuentas ni anuncios', 'Funciona sin conexión', '4 idiomas'],
    imageAlt: 'Subbuteo Scoreboard durante un partido: marcadores gigantes 2–1 y el reloj en 14:57',
    badgeGoal: '¡Gol!',
    badgeClock: '1.ª parte',
  },

  ticker: ['Toca para marcar', 'Reloj por partes', 'Silbato del árbitro', 'Historial de partidos', 'Clasificación de jugadores', 'Tus propios equipos', 'Música de estadio', 'Pantalla completa'],

  features: {
    kicker: 'Funciones',
    title: 'Todo lo que pide un día de partido. Nada que sobre.',
    intro: 'Deja el portátil junto al campo y no pierdas de vista el juego. Cada control es grande, claro y está a un toque.',
    items: [
      { icon: 'tap', title: 'Toca para marcar', text: 'Marcadores gigantes: toca la mitad superior para sumar un gol y la inferior para restarlo. O usa el teclado: <kbd>Q</kbd>/<kbd>A</kbd> y <kbd>P</kbd>/<kbd>L</kbd>.' },
      { icon: 'timer', title: 'Reloj por partes', text: 'Una cuenta atrás para cada parte, con pausa, reanudar, reiniciar la parte y finalizar el partido. Al llegar a cero se detiene y espera a la segunda parte.' },
      { icon: 'shirt', title: 'Elige tus equipos', text: 'Escoge cada equipo en un carrusel con efecto ojo de pez, escribe el nombre de los jugadores, fija la duración de cada parte y da ventaja a quien quieras.' },
      { icon: 'trophy', title: 'Historial y clasificación', text: 'Cada partido se guarda con fecha, equipos, jugadores y resultado. Una tabla ordena victorias, empates, derrotas y diferencia de goles. Expórtalo a CSV.' },
      { icon: 'sound', title: 'Sonido de estadio', text: 'Un silbato de árbitro de verdad para el inicio y el final, el público celebrando cada gol y música de fondo en orden aleatorio.' },
      { icon: 'sliders', title: 'A tu manera', text: 'Añade tus propios equipos y escudos, cambia los sonidos, crea una lista de música y elige una foto de fondo o tu propia imagen.' },
      { icon: 'globe', title: 'Cuatro idiomas', text: 'Castellano, Català, English e Italiano, intercambiables en cualquier momento desde el selector de banderas, con un idioma por defecto al iniciar.' },
      { icon: 'screen', title: 'Pensado para pantalla completa', text: 'Se abre a pantalla completa, mantiene la pantalla encendida durante el partido y respeta la opción Reducir movimiento de macOS. No necesita internet.' },
    ],
  },

  demo: {
    kicker: 'Pruébalo',
    title: 'Venga, marca uno',
    intro: 'Así funciona el marcador. Toca la parte superior de una tarjeta para marcar, la inferior para anular un gol, y pon en marcha el reloj.',
    home: 'Local',
    away: 'Visitante',
    add: 'Suma un gol a {team}',
    remove: 'Resta un gol a {team}',
    start: 'Saque inicial',
    pause: 'Pausa',
    resume: 'Reanudar',
    reset: 'Reiniciar',
    half: '1.ª parte',
    status: { idle: 'Preparados', running: 'En juego', paused: 'En pausa', over: 'Descanso' },
    goal: '¡Gol!',
    keys: 'Teclado: <kbd>Q</kbd>/<kbd>A</kbd> local · <kbd>P</kbd>/<kbd>L</kbd> visitante · <kbd>Espacio</kbd> reloj',
    scoreLive: '{home} {a}, {away} {b}',
  },

  how: {
    kicker: 'Cómo funciona',
    title: 'Del saque inicial al pitido final',
    steps: [
      { title: 'Prepara el partido', text: 'Elige dos equipos, escribe el nombre de los jugadores y decide cuánto dura cada parte.' },
      { title: 'Juega', text: 'Suena el silbato y arranca el reloj. Toca para marcar y deja que el público haga el resto.' },
      { title: 'Guarda el resultado', text: 'Al final del partido, el resultado pasa al historial y la clasificación de jugadores se actualiza sola.' },
    ],
  },

  gallery: {
    kicker: 'Capturas',
    title: 'Echa un vistazo',
    open: 'Abrir la captura: {caption}',
    close: 'Cerrar',
    prev: 'Captura anterior',
    next: 'Captura siguiente',
    items: {
      '02-home': 'Pantalla de inicio',
      '03-new-match': 'Nuevo partido: elige equipos en el carrusel',
      '05-goal': 'Celebración de un gol',
      '06-full-time': 'Resultado final',
      '07-history': 'Historial de partidos',
      '08-standings': 'Clasificación de jugadores',
      '09-settings-teams': 'Configuración: equipos y escudos',
      '10-settings-music': 'Configuración: música de fondo',
      '11-languages': 'Selector de idioma',
    },
  },

  install: {
    kicker: 'Instalación',
    title: 'Listo en un minuto',
    steps: [
      'Descarga el archivo <strong>.dmg</strong> de la última versión en GitHub y ábrelo.',
      'Arrastra <strong>Subbuteo Scoreboard</strong> a la carpeta <strong>Aplicaciones</strong>.',
      'La primera vez, haz clic derecho en la app y elige <strong>Abrir → Abrir</strong>. También puedes permitirla desde <strong>Ajustes del Sistema → Privacidad y seguridad</strong>.',
      'A jugar. El historial y los ajustes se guardan fuera de la app, así que se conservan al actualizarla.',
    ],
    note: 'Requiere macOS en un Mac con Apple silicon. Los desarrolladores pueden compilarla para Windows y Linux a partir del código fuente.',
    cta: 'Descargar la última versión',
  },

  faq: {
    kicker: 'Preguntas',
    title: 'Preguntas frecuentes',
    items: [
      { q: '¿Subbuteo Scoreboard es gratis?', a: 'Sí. Se descarga y se usa gratis, sin cuentas, sin anuncios y sin compras dentro de la app.' },
      { q: '¿En qué ordenadores funciona?', a: 'El instalador está preparado para Mac con Apple silicon. Las versiones para Windows y Linux están en camino, y los desarrolladores ya pueden compilarlas desde el código fuente en GitHub.' },
      { q: '¿Necesita conexión a internet?', a: 'No. Todo, incluidas las fuentes, los sonidos y la música, viene dentro de la app, así que funciona completamente sin conexión.' },
      { q: 'macOS dice que la app no se puede abrir. ¿Qué hago?', a: 'La app todavía no está firmada con un certificado de Apple Developer. Haz clic derecho sobre ella en Aplicaciones y elige <strong>Abrir → Abrir</strong>, o permítela desde <strong>Ajustes del Sistema → Privacidad y seguridad</strong>. Solo hace falta la primera vez.' },
      { q: '¿Puedo añadir mis propios equipos y escudos?', a: 'Sí. En <strong>Configuración → Equipos</strong> puedes añadir equipos, subir escudos y recuperar los originales. Un equipo sin escudo recibe uno generado con sus dos colores.' },
      { q: '¿Dónde se guardan mis partidos?', a: 'En un archivo local de tu Mac (<code>~/Library/Application Support/Subbuteo Scoreboard/</code>). No se envía nada a ninguna parte y puedes exportar el historial a CSV.' },
      { q: '¿Es un producto oficial de Subbuteo?', a: 'No. Es una app no oficial hecha por un aficionado al juego. No está afiliada ni respaldada por los titulares de la marca Subbuteo.' },
    ],
  },

  cta: {
    title: '¿Preparados para el saque inicial?',
    text: 'Descarga Subbuteo Scoreboard y lleva el estadio a tu mesa.',
    button: 'Descargar para Mac',
  },

  footer: {
    tagline: 'Un marcador de escritorio para partidos de Subbuteo y fútbol de mesa.',
    madeBy: 'Diseñado y desarrollado con {heart} en Arenys de Munt por {author}.',
    disclaimer: 'Subbuteo es una marca registrada de su titular. Esta es una app no oficial creada por un aficionado y no está afiliada ni respaldada por el titular de la marca. Los escudos que aparecen en las capturas pertenecen a sus respectivos clubes y federaciones.',
    links: 'Enlaces',
    source: 'Código fuente',
    releases: 'Versiones',
    credits: 'Créditos',
    cookies: 'Configuración de cookies',
    languages: 'Idiomas',
  },

  consent: {
    title: 'Cookies',
    text: 'Usamos cookies de Google Analytics para contar las visitas y saber qué partes de esta página resultan útiles. Solo se instalan si las aceptas.',
    accept: 'Aceptar',
    reject: 'Rechazar',
  },

  suggest: {
    text: 'Esta página también está disponible en español.',
    cta: 'Ver en español',
    dismiss: 'Cerrar',
  },

  notFound: {
    title: '¡Fuera de juego!',
    text: 'La página que buscas no está en el campo. Puede que se haya movido o que nunca haya existido.',
    back: 'Volver a la página de inicio',
    metaTitle: 'Página no encontrada · Subbuteo Scoreboard',
  },
};
