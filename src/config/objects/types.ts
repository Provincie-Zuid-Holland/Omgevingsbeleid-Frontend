import { Schema } from 'zod'

import {
    AmbitieGet,
    AmbitieStaticPost,
    BeleidsdoelGet,
    BeleidsdoelStaticPatch,
    BeleidskeuzeGet,
    BeleidskeuzeStaticPatch,
    MaatregelGet,
    MaatregelStaticPatch,
} from '@/api/fetchers.schemas'

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
        singular: ModelType
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
        description: string
        /** Slug overview */
        slugOverview?: string
    }
    /** Array containing static data fields of object */
    staticData?: StaticData
    /** Fetchers for fetching object data */
    fetchers: Fetchers
    /** Validation schema of form */
    validationSchema?: Schema
    /** Dynamic section containing form fields */
    dynamicSections: DynamicSection<FieldType>[]
    /** Allowed connection types which object can get a relation with */
    allowedConnections?: {
        /** Type of connection */
        type: ModelType
        /** Key of connection, this corresponds with the API field */
        key: keyof ModelReturnType
    }[]
}

export type ModelType = keyof typeof models
export type ModelName =
    | 'Ambities'
    | 'Beleidsdoelen'
    | 'Beleidskeuzes'
    | 'Maatregelen'

export type DynamicSection<FieldType = any> = {
    /** Title of section */
    title: string
    /** Description of section */
    description?: string
    /** Fields in section */
    fields: DynamicField<FieldType>[]
}

export type DynamicField<FieldType = any> = {
    /** Name of field, this is also the API field */
    name: FieldType
    /** Label of field */
    label: string
    /** Description of field (optional) */
    description?: string
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Type of field */
    type: 'text' | 'textarea' | 'wysiwyg' | 'select'
    /** Is field required (optional) */
    required?: boolean
} & (
    | { type: 'select'; options: { label: string; value: string }[] }
    | { type: Exclude<'text' | 'textarea' | 'wysiwyg', 'select'> }
)

export type ModelReturnType = BeleidsdoelGet &
    AmbitieGet &
    BeleidskeuzeGet &
    MaatregelGet

export type ModelPatchStaticType = BeleidsdoelStaticPatch &
    AmbitieStaticPost &
    BeleidskeuzeStaticPatch &
    MaatregelStaticPatch

export type Model = typeof models[ModelType]
