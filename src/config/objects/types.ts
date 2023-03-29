import { Schema } from 'zod'

import {
    AmbitieGet,
    BeleidsdoelGet,
    BeleidskeuzeGet,
    MaatregelGet,
} from '@/api/fetchers.schemas'

import * as models from '.'

export interface DynamicObject<
    Fetchers = {
        [key: string]: any
    }
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

export type Model = typeof models[ModelType]
