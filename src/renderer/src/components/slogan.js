// Eslogan "Subbuteo Scoreboard": se usa en la portada y en el segundo splash.
// Es el nombre de la app, así que no se traduce. Los filetes laterales se
// despliegan cuando un ancestro recibe la clase .is-entered.
export const SLOGAN = 'Subbuteo Scoreboard'

export const sloganMarkup = () => `
  <h1 class="slogan">
    <span class="slogan__rule slogan__rule--left" aria-hidden="true"></span>
    <span class="slogan__text" data-text="${SLOGAN}">${SLOGAN}</span>
    <span class="slogan__rule slogan__rule--right" aria-hidden="true"></span>
  </h1>
`
