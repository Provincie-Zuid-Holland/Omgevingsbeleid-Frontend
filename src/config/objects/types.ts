import { Schema } from 'zod'

import * as models from '.'

export interface DynamicObject<
    Fetchers = {
        [key: string]: any
    },
    QueryKeys = {
        [key: string]: any
    }
> {
    defaults: {
        singular: string
        singularCapitalize: string
        plural: string
        pluralCapitalize: string
        prefixSingular: string
        prefixPlural: string
        prefixNewObject: string
    }
    fetchers: Fetchers
    queryKeys: QueryKeys
    validationSchema?: Schema
    dynamicSections?: DynamicSection[]
}

export type DynamicSection = DynamicDescription | DynamicConnections

export interface DynamicDescription {
    type: 'description'
    description: string
    fieldDescription: string
}

export interface DynamicConnections {
    type: 'connections'
    allowedConnections: keyof typeof models
    description: string
    fieldDescription: string
}

export type Model = typeof models[keyof typeof models]
