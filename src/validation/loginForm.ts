import { z } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = z.object({
    email: schemaDefaults.email(),
    password: schemaDefaults.requiredString(),
})
