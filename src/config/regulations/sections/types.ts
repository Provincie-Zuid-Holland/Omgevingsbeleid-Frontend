import * as sections from '.'
import { ContentType } from '../contents/types'

export type SectionType = keyof typeof sections

export interface Section {
    /** Type of section */
    type: SectionType
    /** Default information of section */
    defaults: {
        /** Singular of section */
        singular: string
        /** Singular of section (capitalized) */
        singularCapitalize: string
        /** Prefix value of singular */
        prefixSingular: string
        /** Demonstrative pronoun of section */
        demonstrative: string
        /** Icon of section */
        icon: any
        /** If section is using parent index in structure */
        parentIndex?: boolean
    }
    /** Children of section */
    children?: SectionType[]
    /** Contents of section */
    contents?: ContentType[]
}
