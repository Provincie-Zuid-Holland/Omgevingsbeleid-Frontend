import { z } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_RELATION_ADD = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Explanation: schemaDefaults.requiredString(),
})

export const SCHEMA_RELATION_EDIT = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Explanation: schemaDefaults.requiredString(),
})

export const SCHEMA_RELATION_DISCONNECT = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    consent: z.boolean(),
})
