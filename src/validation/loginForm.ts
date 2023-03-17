import { z } from 'zod'

import { schemaDefaults } from '@/utils/zodSchema'

export const SCHEMA = z.object({
    email: schemaDefaults.email(),
    password: schemaDefaults.requiredString(),
})
