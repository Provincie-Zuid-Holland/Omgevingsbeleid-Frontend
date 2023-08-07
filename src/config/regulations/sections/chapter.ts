import { Section } from './types'

import { article, division } from '.'

const chapter: Section = {
    type: 'chapter',
    name: 'Hoofdstuk',
    children: [division, article],
}

export default chapter
