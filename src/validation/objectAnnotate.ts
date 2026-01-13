import { object } from 'zod'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_OBJECT_ANNOTATE_AREA = object({
    group: schemaDefaults.requiredString(),
    type: schemaDefaults.requiredString(),
    location: schemaDefaults.requiredString(),
    label: schemaDefaults.requiredString(),
    id: schemaDefaults.requiredString(),
})
