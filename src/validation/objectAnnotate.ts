import { object } from 'zod'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_OBJECT_ANNOTATE_AREA = object({
    Object_Code: schemaDefaults.requiredString(),
})
