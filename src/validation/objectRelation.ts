import { z } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Description: schemaDefaults.requiredString(),
})
