import { object } from 'zod'

import createEmptyObject from '@/utils/createEmptyObject'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_ADD_USER = object({
    name: schemaDefaults.requiredString(),
    email: schemaDefaults.email(),
    roles: schemaDefaults.requiredOptions,
})

export const EMPTY_SCHEMA_ADD_USER = createEmptyObject(SCHEMA_ADD_USER)
