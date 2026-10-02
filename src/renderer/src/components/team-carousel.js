// Carrusel de equipos con efecto "fish-eye" (estilo PES/FIFA), sobre SplideJS.
// Cada escudo recibe data-d = distancia al centro; el CSS escala y atenúa según esa distancia.
import Splide from '@splidejs/splide'
import '@splidejs/splide/css/core'
import { crestUrl, esc, teamName } from '../core/utils.js'
import { t } from '../i18n/index.js'

const MAX_DISTANCE = 3

export function teamCarouselMarkup(teams) {
  return `
    <div class="team-carousel splide" aria-label="${esc(t('setup.team'))}">
      <div class="splide__track">
        <ul class="splide__list">
          ${teams.map((team) => `
            <li class="splide__slide team-carousel__slide" data-team-id="${esc(team.id)}">
              <img class="team-carousel__crest" src="${esc(crestUrl(team))}" alt="${esc(teamName(team))}" draggable="false" />
            </li>`).join('')}
        </ul>
      </div>
    </div>`
}

export function mountTeamCarousel(el, { teams, selectedId, onChange }) {
  const start = Math.max(0, teams.findIndex((team) => team.id === selectedId))
  const splide = new Splide(el, {
    type: 'loop',
    focus: 'center',
    fixedWidth: '124px',
    gap: 0,
    start,
    speed: 450,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    pagination: false,
    keyboard: 'focused',
    flickPower: 300,
    updateOnMove: true,
    i18n: { prev: t('setup.prevTeam'), next: t('setup.nextTeam'), carousel: t('setup.team'), slide: t('setup.team') }
  })

  // Distancia circular: al dar la vuelta, Splide anima hasta un clon (destIndex fuera de
  // 0…n-1) y al acabar salta sin avisar al original. Contando también la distancia a una
  // vuelta de distancia, clon y original reciben el mismo tamaño y el salto no se nota.
  const n = teams.length
  const applyDistances = (center) => {
    splide.Components.Slides.forEach(({ index, slide }) => {
      const d = Math.min(...[-n, 0, n].map((lap) => Math.abs(index - center + lap)))
      slide.dataset.d = Math.min(d, MAX_DISTANCE)
    })
  }

  splide.on('mounted', () => applyDistances(splide.index))
  splide.on('move', (_index, _prev, destIndex) => applyDistances(destIndex))
  splide.on('moved', (index) => onChange(teams[index].id))
  // Clic en un escudo lateral: desplazarse hasta él por el camino corto
  splide.on('click', ({ index }) => {
    const delta = index - splide.index
    if (delta) splide.go(delta > 0 ? `+${delta}` : `-${-delta}`)
  })

  splide.mount()
  return splide
}
