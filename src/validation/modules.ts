import { array, object } from 'zod'

import {
    CompleteModule,
    ModuleAddNewObject,
    ModuleCreate,
} from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = object({
    Title: schemaDefaults.title,
    Description: schemaDefaults.requiredString(),
    Module_Manager_1_UUID: schemaDefaults.requiredString(),
    Module_Manager_2_UUID: schemaDefaults.optionalString,
})

export const EMPTY_CREATE_MODULE: ModuleCreate = createEmptyObject(SCHEMA)

export const SCHEMA_ADD_OBJECT_STEPS = [
    object({ state: schemaDefaults.requiredString() }),
    object({ Object_Type: schemaDefaults.requiredString() }),
    object({
        Title: schemaDefaults.title,
        Owner_1_UUID: schemaDefaults.requiredString(),
        Owner_2_UUID: schemaDefaults.optionalString,
        Explanation: schemaDefaults.optionalString,
        Conclusion: schemaDefaults.optionalString,
    }),
    object({ Object_UUID: schemaDefaults.requiredString() }),
    object({
        Action: schemaDefaults.requiredString(),
        Explanation: schemaDefaults.optionalString,
        Conclusion: schemaDefaults.optionalString,
    }),
]

export const SCHEMA_ADD_NEW_OBJECT = object({
    Object_Type: schemaDefaults.requiredString(),
    Object_UUID: schemaDefaults.requiredString(),
    Title: schemaDefaults.title,
    Owner_1_UUID: schemaDefaults.requiredString(),
    Owner_2_UUID: schemaDefaults.optionalString,
    Explanation: schemaDefaults.optionalString,
    Conclusion: schemaDefaults.optionalString,
})

export const SCHEMA_EDIT_EXISTING_OBJECT = object({
    Action: schemaDefaults.optionalString,
    Explanation: schemaDefaults.optionalString,
    Conclusion: schemaDefaults.optionalString,
})

export const SCHEMA_COMPLETE_MODULE = object({
    IDMS_Link: schemaDefaults.url(),
    Decision_Number: schemaDefaults.requiredString(),
    Link_To_Decision_Document: schemaDefaults.url(),
    ObjectSpecifiekeGeldigheden: array(
        object({
            Object_Type: schemaDefaults.requiredString(),
            Object_ID: schemaDefaults.requiredNumber(),
            Start_Validity: schemaDefaults.date(),
        }).partial({
            Start_Validity: true,
        })
    ),
})

export const SCHEMA_COMPLETE_MODULE_STEPS = [
    object({
        Default_Start_Validity: schemaDefaults.date(),
        IDMS_Link: schemaDefaults.url(),
        Decision_Number: schemaDefaults.requiredString(),
        Link_To_Decision_Document: schemaDefaults.url(),
    }),
    object({
        ObjectSpecifiekeGeldigheden: array(
            object({
                Object_Type: schemaDefaults.requiredString(),
                Object_ID: schemaDefaults.requiredNumber(),
                Start_Validity: schemaDefaults.date(),
            }).partial({
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
