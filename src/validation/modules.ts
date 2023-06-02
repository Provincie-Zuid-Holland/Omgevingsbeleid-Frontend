import { z } from 'zod'

import {
    ModuleCreate,
    ModuleAddNewObject,
    CompleteModule,
} from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = z.object({
    Title: schemaDefaults.title,
    Description: schemaDefaults.requiredString(),
    Module_Manager_1_UUID: schemaDefaults.requiredString(),
    Module_Manager_2_UUID: schemaDefaults.optionalString,
})

export const EMPTY_CREATE_MODULE: ModuleCreate = createEmptyObject(SCHEMA)

export const SCHEMA_ADD_OBJECT_STEPS = [
    z.object({ state: schemaDefaults.requiredString() }),
    z.object({ Object_Type: schemaDefaults.requiredString() }),
    z.object({
        Title: schemaDefaults.title,
        Owner_1_UUID: schemaDefaults.requiredString(),
        Owner_2_UUID: schemaDefaults.optionalString,
        Explanation: schemaDefaults.requiredString(),
        Conclusion: schemaDefaults.requiredString(),
    }),
    z.object({ Object_UUID: schemaDefaults.requiredString() }),
    z.object({
        Action: schemaDefaults.title,
        Explanation: schemaDefaults.requiredString(),
        Conclusion: schemaDefaults.requiredString(),
    }),
]

export const SCHEMA_ADD_NEW_OBJECT = z.object({
    Object_Type: schemaDefaults.requiredString(),
    Title: schemaDefaults.title,
    Owner_1_UUID: schemaDefaults.requiredString(),
    Owner_2_UUID: schemaDefaults.optionalString,
    Explanation: schemaDefaults.requiredString(),
    Conclusion: schemaDefaults.requiredString(),
})

export const SCHEMA_EDIT_EXISTING_OBJECT = z.object({
    Action: schemaDefaults.optionalString,
    Explanation: schemaDefaults.optionalString,
    Conclusion: schemaDefaults.optionalString,
})

export const SCHEMA_COMPLETE_MODULE = z.object({
    IDMS_Link: schemaDefaults.url(),
    Decision_Number: schemaDefaults.requiredString(),
    Link_To_Decision_Document: schemaDefaults.url(),
    ObjectSpecifiekeGeldigheden: z.array(
        z
            .object({
                Object_Type: schemaDefaults.requiredString(),
                Object_ID: schemaDefaults.requiredNumber(),
                Start_Validity: schemaDefaults.date,
            })
            .partial({
                Start_Validity: true,
            })
    ),
})

export const SCHEMA_COMPLETE_MODULE_STEPS = [
    z.object({
        Default_Start_Validity: schemaDefaults.date,
        IDMS_Link: schemaDefaults.url(),
        Decision_Number: schemaDefaults.requiredString(),
        Link_To_Decision_Document: schemaDefaults.url(),
    }),
    z.object({
        ObjectSpecifiekeGeldigheden: z.array(
            z
                .object({
                    Object_Type: schemaDefaults.requiredString(),
                    Object_ID: schemaDefaults.requiredNumber(),
                    Start_Validity: schemaDefaults.date,
                })
                .partial({
                    Start_Validity: true,
                })
        ),
    }),
]

export const EMPTY_SCHEMA_COMPLETE_MODULE: CompleteModule = createEmptyObject(
    SCHEMA_COMPLETE_MODULE
)

export const EMPTY_MODULE_OBJECT: ModuleAddNewObject = createEmptyObject(
    SCHEMA_ADD_NEW_OBJECT
)
