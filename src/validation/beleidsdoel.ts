import { z } from 'zod'

import { schemaDefaults } from '@/utils/zodSchema'

export const SCHEMA = z.object({
    Title: schemaDefaults.title,
    Description: schemaDefaults.requiredString(),
})
