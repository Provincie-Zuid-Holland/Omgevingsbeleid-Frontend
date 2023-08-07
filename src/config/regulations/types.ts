import { Section } from './sections/types'

export interface Regulation {
    /** Title of regulation */
    title: string
    /** Sections in regulation */
    sections: Section[]
}
