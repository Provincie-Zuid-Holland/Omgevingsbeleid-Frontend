import { Schema } from 'zod'

import {
    AmbitieGet,
    AmbitiePatch,
    AmbitieStaticPostStatics,
    BeleidsdoelGet,
    BeleidsdoelPatch,
    BeleidsdoelStaticPatchStatics,
    BeleidskeuzeGet,
    BeleidskeuzePatch,
    BeleidskeuzeStaticPatchStatics,
    MaatregelGet,
    MaatregelPatch,
    MaatregelStaticPatchStatics,
    NationaalBelangGet,
    VerplichtProgrammaGet,
    WettelijkeTaakGet,
} from '@/api/fetchers.schemas'

import { DynamicSection } from '../types'

import * as models from '.'

export interface DynamicObject<
    Fetchers = {
        [key: string]: any
    },
    FieldType = any,
    StaticData = any
> {
    /** Default information of object */
    defaults: {
        /** Singular of object type */
        singular: string
        /** Readable singular of object type */
        singularReadable: string
        /** Singular of object type (capitalized) */
        singularCapitalize: string
        /** Plural of object type */
        plural: string
        /** Plural of object type (capitalized) */
        pluralCapitalize: string
        /** Prefix value of singular */
        prefixSingular: string
        /** Prefix value of plural */
        prefixPlural: string
        /** Prefix when creating new object */
        prefixNewObject: string
        /** Description of object */
        description?: string
        /** Slug overview */
        slugOverview?: string
        /** Demonstrative pronoun of object type */
        demonstrative?: string
        /** Atemporal object */
        atemporal?: boolean
    }
    /** Array containing static data fields of object */
    staticData?: StaticData
    /** Fetchers for fetching object data */
    fetchers: Fetchers
    /** Validation schema of form */
    validationSchema?: Schema
    /** Dynamic section containing form fields */
    dynamicSections: DynamicSection<FieldType>[]
    /** Allowed connection types which object can get a connection with */
    allowedConnections?: {
        /** Type of connection */
        type: ModelType
        /** Key of connection, this corresponds with the API field */
        key: keyof ModelReturnType
    }[]
    /** Description which is shown in the connections section on a detail page */
    connectionsDescription?: string | JSX.Element
    /** Acknowledged relation type */
    acknowledgedRelation?: ModelType
}

export type ModelType = keyof typeof models

export type ModelReturnType = BeleidsdoelGet &
    AmbitieGet &
    BeleidskeuzeGet &
    MaatregelGet &
    NationaalBelangGet &
    WettelijkeTaakGet &
    VerplichtProgrammaGet

export type ModelPatchType = BeleidsdoelPatch &
    AmbitiePatch &
    BeleidskeuzePatch &
    MaatregelPatch

export type ModelPatchStaticType = BeleidsdoelStaticPatchStatics &
    AmbitieStaticPostStatics &
    BeleidskeuzeStaticPatchStatics &
    MaatregelStaticPatchStatics

export type Model = typeof models[ModelType]
