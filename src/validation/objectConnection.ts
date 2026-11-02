import { array, object, string } from 'zod'

import { WriteRelation } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_CONNECTION_STEPS = [
    object({}),
    object({
        object_id: schemaDefaults.requiredNumber(),
    }),
    object({
        description: schemaDefaults.requiredString(),
    }),
    object({}),
]

export const SCHEMA = object({
    object_type: schemaDefaults.requiredString(),
    object_id: schemaDefaults.requiredNumber(),
    description: string().optional(),
}).or(
    array(
        object({
            object_type: schemaDefaults.requiredString(),
            object_id: schemaDefaults.requiredNumber(),
        })
    )
)

export const EMPTY_CONNECTION_OBJECT: WriteRelation | WriteRelation[] =
    createEmptyObject(SCHEMA)
