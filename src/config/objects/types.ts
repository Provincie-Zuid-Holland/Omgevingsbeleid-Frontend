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
    StaticData = any
> {
    defaults: {
        singular: ModelType
        singularCapitalize: string
        plural: string
        pluralCapitalize: string
        prefixSingular: string
        prefixPlural: string
        prefixNewObject: string
        description: string
        slugOverview?: string
    }
    staticData?: StaticData
    fetchers: Fetchers
    validationSchema?: Schema
    dynamicSections?: DynamicSection[]
    allowedConnections?: {
        type: ModelType
        key: keyof ModelReturnType
    }[]
}

export type ModelType = keyof typeof models
export type ModelName =
    | 'Ambities'
    | 'Beleidsdoelen'
    | 'Beleidskeuzes'
    | 'Maatregelen'

export type DynamicSection = DynamicDescription

export interface DynamicDescription {
    type: 'description'
    description: string
    fieldDescription: string
}

export type ModelReturnType = BeleidsdoelGet &
    AmbitieGet &
    BeleidskeuzeGet &
    MaatregelGet

export type ModelPatchStaticType = BeleidsdoelStaticPatch &
    AmbitieStaticPost &
    BeleidskeuzeStaticPatch &
    MaatregelStaticPatch

export type Model = typeof models[ModelType]
