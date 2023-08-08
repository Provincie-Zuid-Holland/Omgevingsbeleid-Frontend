import * as sections from '.'

export type SectionType = keyof typeof sections

export interface Section {
    /** Type of section */
    type: SectionType
    /** Name of section */
    name: string
    /** Children of section */
    children?: Section[]
    /** Icon of section */
    icon: any
}
