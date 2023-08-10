import { Paragraph } from '@pzh-ui/icons'

import { Section } from './types'

const paragraph: Section = {
    type: 'paragraph',
    defaults: {
        name: 'Paragraaf',
        demonstrative: 'deze',
        icon: Paragraph,
    },
    children: ['article'],
}

export default paragraph
