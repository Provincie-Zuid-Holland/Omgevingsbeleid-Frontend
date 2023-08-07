import { Section } from './types'

import { article } from './'

const paragraph: Section = {
    type: 'paragraph',
    name: 'Paragraaf',
    children: [article],
}

export default paragraph
