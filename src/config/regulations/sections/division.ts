import { Section as SectionIcon } from '@pzh-ui/icons'

import { Section } from './types'

import { article, paragraph } from './'

const division: Section = {
    type: 'division',
    name: 'Afdeling',
    icon: SectionIcon,
    children: [paragraph, article],
}

export default division
