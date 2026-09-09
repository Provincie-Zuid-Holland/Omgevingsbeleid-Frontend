import figure from './figure'
import formula from './formula'
import list from './list'
import paragraph from './paragraph'
import type { Content } from './types'

const group: Content = {
    type: 'group',
    name: 'Groep',
    children: [paragraph, list, figure, formula],
}

export default group
