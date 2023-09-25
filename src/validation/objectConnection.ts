import { array, object } from 'zod'

import { WriteRelation } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_CONNECTION_STEPS = [
    object({}),
    object({ Object_ID: schemaDefaults.requiredNumber() }),
    object({
        Description: schemaDefaults.requiredString(),
    }),
]

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

export const EMPTY_CONNECTION_OBJECT: WriteRelation | WriteRelation[] =
    createEmptyObject(SCHEMA)
