import { Schema } from 'zod'

export interface DynamicObject<
    Fetchers = {
        [key: string]: any
    }
> {
    defaults: {
        singular: string
        plural: string
        pluralCapitalize: string
        prefixSingular: string
        prefixPlural: string
        prefixNewObject: string
    }
    fetchers: Fetchers
    validationSchema?: Schema
}
