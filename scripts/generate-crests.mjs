// Regenera los escudos provisionales de src/renderer/public/crests.
// Sustituye cualquier SVG por el escudo oficial manteniendo el mismo nombre de archivo.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { DEFAULT_TEAMS } from '../src/shared/defaults.js'
import { crestSvg } from '../src/shared/crest-svg.js'

const INITIALS = {
  'fc-barcelona': 'FCB',
  'atletico-madrid': 'ATM',
  arsenal: 'AFC',
  'west-ham-united': 'WHU',
  'badalona-cf': 'CFB',
  'ue-sant-andreu': 'UESA',
  espana: 'ESP',
  brasil: 'BRA',
  argentina: 'ARG',
  catalunya: 'CAT'
}

for (const team of DEFAULT_TEAMS) {
  const file = resolve('src/renderer/public/crests', `${team.id}.svg`)
  writeFileSync(file, crestSvg({ colors: team.colors, initials: INITIALS[team.id] }) + '\n')
  console.log('✔', file)
}
