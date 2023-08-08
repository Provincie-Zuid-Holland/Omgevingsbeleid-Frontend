import { Heading } from '@pzh-ui/icons'

import { Section } from './types'

import { article, division } from '.'

const chapter: Section = {
    type: 'chapter',
    name: 'Hoofdstuk',
    icon: Heading,
    children: [division, article],
}

export default chapter
