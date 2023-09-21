import { Content } from './types'

import { figure, formula, list, paragraph } from '.'

const group: Content = {
    type: 'group',
    name: 'Groep',
    children: [paragraph, list, figure, formula],
}

export default group
