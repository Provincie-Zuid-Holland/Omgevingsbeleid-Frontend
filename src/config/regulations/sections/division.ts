import { Section } from './types'

import { article, paragraph } from './'

const division: Section = {
    type: 'division',
    name: 'Afdeling',
    children: [paragraph, article],
}

export default division
