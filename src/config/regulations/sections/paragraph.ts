import { Paragraph } from '@pzh-ui/icons'

import { Section } from './types'

const paragraph: Section = {
    type: 'paragraph',
    defaults: {
        singular: 'paragraaf',
        singularCapitalize: 'Paragraaf',
        prefixSingular: 'de',
        demonstrative: 'deze',
        icon: Paragraph,
        parentIndex: true,
    },
    children: ['article'],
}

export default paragraph
