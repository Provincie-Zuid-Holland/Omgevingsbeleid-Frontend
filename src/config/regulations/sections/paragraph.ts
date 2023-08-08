import { Paragraph } from '@pzh-ui/icons'

import { Section } from './types'

import { article } from './'

const paragraph: Section = {
    type: 'paragraph',
    name: 'Paragraaf',
    icon: Paragraph,
    children: [article],
}

export default paragraph
