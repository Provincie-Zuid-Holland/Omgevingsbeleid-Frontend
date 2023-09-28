import { Font } from '@pzh-ui/icons'

import { Section } from './types'

const article: Section = {
    type: 'article',
    defaults: {
        singular: 'artikel',
        singularCapitalize: 'Artikel',
        prefixSingular: 'het',
        demonstrative: 'dit',
        icon: Font,
    },
    children: ['member'],
}

export default article
