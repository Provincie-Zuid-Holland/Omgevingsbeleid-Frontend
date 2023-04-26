import { Schema } from 'zod'

import { RegulationTypes } from '@/api/fetchers.schemas'

import { DynamicSection } from '../types'

import * as models from '.'

export interface Regulation<FieldType = any> {
    /** Default information of object */
    defaults: {
        /** Regulation type */
        regulationType: RegulationTypes
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
        description?: string
        /** Slug overview */
        slugOverview?: string
    }
    /** Validation schema of form */
    validationSchema?: Schema
    /** Dynamic section containing form fields */
    dynamicSections: DynamicSection<FieldType>[]
}

export type ModelType = Exclude<keyof typeof models, 'default'>

export type Model = typeof models[ModelType]
