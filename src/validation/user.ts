import { object } from 'zod'

import createEmptyObject from '@/utils/createEmptyObject'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_ADD_USER = object({
    Gebruikersnaam: schemaDefaults.requiredString(),
    Email: schemaDefaults.email(),
    Roles: schemaDefaults.requiredOptions,
})

export const EMPTY_SCHEMA_ADD_USER = createEmptyObject(SCHEMA_ADD_USER)
