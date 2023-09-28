import { object, boolean } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_RELATION_ADD = object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Explanation: schemaDefaults.requiredString(),
})

export const SCHEMA_RELATION_EDIT = object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Explanation: schemaDefaults.requiredString(),
})

export const SCHEMA_RELATION_DISCONNECT = object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    consent: boolean(),
})
