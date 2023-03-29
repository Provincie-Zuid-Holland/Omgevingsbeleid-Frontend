import { z } from 'zod'

import { RelationShort } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/utils/zodSchema'

export const SCHEMA = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Object_ID: schemaDefaults.requiredNumber(),
    Description: schemaDefaults.requiredString(),
})

export const EMPTY_RELATION_OBJECT: RelationShort = createEmptyObject(SCHEMA)
