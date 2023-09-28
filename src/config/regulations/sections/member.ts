import { FileLines } from '@pzh-ui/icons'

import { Section } from './types'

const member: Section = {
    type: 'member',
    defaults: {
        singular: 'lid',
        singularCapitalize: 'Lid',
        prefixSingular: 'het',
        demonstrative: 'dit',
        icon: FileLines,
        parentIndex: false,
    },
}

export default member
