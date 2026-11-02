import { array, object, string } from 'zod'

import {
    CompleteModule,
    ModuleAddNewObject,
    ModuleCreate,
} from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA = object({
    title: schemaDefaults.title,
    description: schemaDefaults.requiredString(),
    module_manager_1_id: schemaDefaults.requiredString(),
    module_manager_2_id: schemaDefaults.optionalString,
})

export const EMPTY_CREATE_MODULE: ModuleCreate = createEmptyObject(SCHEMA)

export const SCHEMA_ADD_OBJECT_STEPS = [
    object({ state: schemaDefaults.requiredString() }),
    object({ object_type: schemaDefaults.requiredString() }),
    object({
        title: schemaDefaults.title,
        owner_1_id: schemaDefaults.requiredString(),
        owner_2_id: schemaDefaults.optionalString,
        explanation: schemaDefaults.optionalString,
        conclusion: schemaDefaults.optionalString,
    }),
    object({ object_id: schemaDefaults.requiredString() }),
    object({
        action: schemaDefaults.requiredString(),
        explanation: schemaDefaults.optionalString,
        conclusion: schemaDefaults.optionalString,
    }),
]

export const SCHEMA_ADD_NEW_OBJECT = object({
    object_type: schemaDefaults.requiredString(),
    object_id: schemaDefaults.requiredString(),
    title: schemaDefaults.title,
    owner_1_id: schemaDefaults.requiredString(),
    owner_2_id: schemaDefaults.optionalString,
    explanation: string().optional(),
    conclusion: string().optional(),
})

export const SCHEMA_EDIT_EXISTING_OBJECT = object({
    action: schemaDefaults.optionalString,
    explanation: schemaDefaults.optionalString,
    conclusion: schemaDefaults.optionalString,
})

export const SCHEMA_COMPLETE_MODULE = object({
    start_validity: schemaDefaults.date(),
    // IDMS_Link: schemaDefaults.url(),
    // Decision_Number: schemaDefaults.requiredString(),
    // Link_To_Decision_Document: schemaDefaults.url(),
    // ObjectSpecifiekeGeldigheden: array(
    //     object({
    //         Object_Type: schemaDefaults.requiredString(),
    //         Object_ID: schemaDefaults.requiredNumber(),
    //         Start_Validity: schemaDefaults.date(),
    //     }).partial({
    //         Start_Validity: true,
    //     })
    // ),
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
                object_type: schemaDefaults.requiredString(),
                object_id: schemaDefaults.requiredNumber(),
                start_validity: schemaDefaults.date(),
            }).partial({
                start_validity: true,
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
