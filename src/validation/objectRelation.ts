import { boolean, object } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_RELATION_STEPS = [
    object({ object_id: schemaDefaults.requiredNumber() }),
    object({
        explanation: schemaDefaults.requiredString(),
    }),
]

export const SCHEMA_RELATION_ADD = object({
    object_type: schemaDefaults.requiredString(),
    object_id: schemaDefaults.requiredNumber(),
    explanation: schemaDefaults.requiredString(),
})

export const SCHEMA_RELATION_EDIT = object({
    object_type: schemaDefaults.requiredString(),
    object_id: schemaDefaults.requiredNumber(),
    explanation: schemaDefaults.requiredString(),
})

export const SCHEMA_RELATION_DISCONNECT = object({
    object_type: schemaDefaults.requiredString(),
    object_id: schemaDefaults.requiredNumber(),
    consent: boolean(),
})
