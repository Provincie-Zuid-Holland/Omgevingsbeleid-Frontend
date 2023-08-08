import { Font } from '@pzh-ui/icons'

import { Section } from './types'

import { member } from './'

const article: Section = {
    type: 'article',
    name: 'Artikel',
    icon: Font,
    children: [member],
}

export default article
