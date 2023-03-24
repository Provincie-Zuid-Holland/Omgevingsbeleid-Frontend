import { Schema } from 'zod'

import * as models from '.'

export interface DynamicObject<
    Fetchers = {
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
        description: string
        slugOverview?: string
    }
    fetchers: Fetchers
    validationSchema?: Schema
    dynamicSections?: DynamicSection[]
    allowedConnections?: (keyof typeof models)[]
}

export type DynamicSection = DynamicDescription

export interface DynamicDescription {
    type: 'description'
    description: string
    fieldDescription: string
}

export type Model = typeof models[keyof typeof models]
