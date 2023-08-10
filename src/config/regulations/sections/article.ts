import { Font } from '@pzh-ui/icons'

import { Section } from './types'

const article: Section = {
    type: 'article',
    defaults: {
        name: 'Artikel',
        demonstrative: 'dit',
        icon: Font,
    },
    children: ['member'],
}

export default article
