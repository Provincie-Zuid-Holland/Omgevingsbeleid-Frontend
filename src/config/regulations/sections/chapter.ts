import { Heading } from '@pzh-ui/icons'

import { Section } from './types'

const chapter: Section = {
    type: 'chapter',
    defaults: {
        singular: 'hoofdstuk',
        singularCapitalize: 'Hoofdstuk',
        prefixSingular: 'het',
        demonstrative: 'dit',
        icon: Heading,
    },
    children: ['division', 'article'],
}

export default chapter
