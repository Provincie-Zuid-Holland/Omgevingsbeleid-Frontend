import { object } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = object({
    email: schemaDefaults.email(),
    password: schemaDefaults.requiredString(),
})
