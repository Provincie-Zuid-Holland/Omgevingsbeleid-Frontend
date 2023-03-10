import { z } from 'zod'

import { ModuleCreate, ModuleAddNewObject } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/utils/zodSchema'

export const SCHEMA = z.object({
    Title: schemaDefaults.Title,
    Description: schemaDefaults.requiredString(),
    Module_Manager_1_UUID: schemaDefaults.requiredString(),
    Module_Manager_2_UUID: schemaDefaults.optionalString,
})

export const EMPTY_CREATE_MODULE: ModuleCreate = createEmptyObject(SCHEMA)

export const SCHEMA_ADD_NEW_OBJECT = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Title: schemaDefaults.Title,
    Owner_1_UUID: schemaDefaults.requiredString(),
    Owner_2_UUID: schemaDefaults.optionalString,
    Explanation: schemaDefaults.requiredString(),
    Conclusion: schemaDefaults.requiredString(),
})

export const SCHEMA_ADD_EXISTING_OBJECT = z.object({
    Object_UUID: schemaDefaults.requiredString(),
    Action: schemaDefaults.requiredString(),
    Explanation: schemaDefaults.requiredString(),
    Conclusion: schemaDefaults.requiredString(),
})

const baseObjectShape = z.object({
    Explanation: schemaDefaults.requiredString(),
    Conclusion: schemaDefaults.requiredString(),
})

export const SCHEMA_ADD_OBJECT = z
    .discriminatedUnion('state', [
        z.object({
            state: z.literal('new'),
            Object_Type: schemaDefaults.requiredString(),
            Title: schemaDefaults.Title,
            Owner_1_UUID: schemaDefaults.requiredString(),
            Owner_2_UUID: schemaDefaults.optionalString,
        }),
        z.object({
            state: z.literal('existing'),
            Object_UUID: schemaDefaults.requiredString(),
            Action: schemaDefaults.requiredString(),
        }),
    ])
    .and(baseObjectShape)

export const EMPTY_MODULE_OBJECT: ModuleAddNewObject = createEmptyObject(
    SCHEMA_ADD_NEW_OBJECT
)
