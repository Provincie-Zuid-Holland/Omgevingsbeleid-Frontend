import { object } from 'zod'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_OBJECT_ANNOTATE_AREA = object({
    group: schemaDefaults.requiredString(),
    areaType: schemaDefaults.requiredString(),
    areaGroup: schemaDefaults.requiredString(),
})
