import { object } from 'zod'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_OBJECT_ANNOTATE_AREA = object({
    title: schemaDefaults.requiredString(),
    type: schemaDefaults.requiredString(),
    group: schemaDefaults.requiredString(),
    locations: schemaDefaults.requiredArray(),
    context: schemaDefaults.requiredString(),
})
