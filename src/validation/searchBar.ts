import { object } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = object({
    query: schemaDefaults
        .requiredString()
        .min(3, 'Zoekterm moet minimaal 3 karakters bevatten'),
})
