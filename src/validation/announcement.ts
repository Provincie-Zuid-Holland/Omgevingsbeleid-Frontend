import { array, object } from 'zod'

import { schemaDefaults } from './zodSchema'

export const ANNOUNCEMENT_EDIT_SCHEMA = object({
    meta_data: object({
        official_title: schemaDefaults.requiredString(),
    }),
    content: object({
        texts: array(
            object({
                title: schemaDefaults.optionalString,
                description: schemaDefaults.requiredString(),
            })
        ),
    }),
    announcement_date: schemaDefaults.requiredString(),
    procedural: object({
        begin_inspection_period_date: schemaDefaults.requiredString(),
        end_inspection_period_date: schemaDefaults.requiredString(),
    }),
})
