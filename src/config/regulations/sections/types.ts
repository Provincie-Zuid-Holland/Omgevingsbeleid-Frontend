import * as sections from '.'

export type SectionType = keyof typeof sections

export interface Section {
    /** Type of section */
    type: SectionType
    /** Default information of section */
    defaults: {
        /** Name of section */
        name: string
        /** Demonstrative pronoun of section */
        demonstrative: string
        /** Icon of section */
        icon: any
    }
    /** Children of section */
    children?: SectionType[]
}
