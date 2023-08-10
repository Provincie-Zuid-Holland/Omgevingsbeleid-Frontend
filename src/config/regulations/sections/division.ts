import { Section as SectionIcon } from '@pzh-ui/icons'

import { Section } from './types'

const division: Section = {
    type: 'division',
    defaults: {
        name: 'Afdeling',
        demonstrative: 'deze',
        icon: SectionIcon,
    },
    children: ['paragraph', 'article'],
}

export default division
