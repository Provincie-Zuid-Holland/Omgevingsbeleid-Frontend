import { object } from 'zod'

import { UserCreate } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_ADD_USER = object({
    Gebruikersnaam: schemaDefaults.requiredString(),
    Email: schemaDefaults.email(),
    Rol: schemaDefaults.requiredString(),
})

export const EMPTY_SCHEMA_ADD_USER: UserCreate =
    createEmptyObject(SCHEMA_ADD_USER)
