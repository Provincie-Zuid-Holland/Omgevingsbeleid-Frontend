import { Content } from './contents/types'
import { SectionType } from './sections/types'

export type Structure = {
    uuid?: string
    type: SectionType
    title?: string
    index?: string
    children?: Structure[]
    contents?: Content[]
}

export interface Regulation {
    /** Title of regulation */
    title: string
    /** Structure of regulation */
    structure: Structure[]
}
