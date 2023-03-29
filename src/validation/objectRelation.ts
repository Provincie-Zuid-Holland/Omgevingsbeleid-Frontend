import { z } from 'zod'

import { schemaDefaults } from '@/utils/zodSchema'

export const SCHEMA = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Description: schemaDefaults.requiredString(),
})
