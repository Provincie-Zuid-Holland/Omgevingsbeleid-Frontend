import { object, array } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Description: schemaDefaults.requiredString(),
}).or(
    array(
        object({
            Object_Type: schemaDefaults.requiredString(),
            Object_ID: schemaDefaults.requiredNumber(),
        })
    )
)
