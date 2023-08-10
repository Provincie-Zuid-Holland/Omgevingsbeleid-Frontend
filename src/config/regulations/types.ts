import { SectionType } from './sections/types'

export type Structure = {
    id?: string
    type: SectionType
    children?: Structure[]
}

export interface Regulation {
    /** Title of regulation */
    title: string
    /** Structure of regulation */
    structure: Structure[]
}
