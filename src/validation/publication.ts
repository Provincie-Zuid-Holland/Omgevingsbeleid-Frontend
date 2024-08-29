import { ZodIssueCode, array, object, z } from 'zod'

import { DocumentType, ProcedureType } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_PUBLICATION_STEPS = [
    object({ Document_Type: schemaDefaults.requiredString() }),
    object({ Procedure_Type: schemaDefaults.requiredString() }),
    object({
        Environment_UUID: schemaDefaults.requiredString(),
    }),
    object({
        Act_UUID: schemaDefaults.requiredString(),
        Template_UUID: schemaDefaults.requiredString(),
    }),
    object({
        Title: schemaDefaults.requiredString(),
    }),
    object({
        Module_Status_ID: schemaDefaults.requiredNumber(),
    }),
]

export const SCHEMA_PUBLICATION = object({
    Module_ID: schemaDefaults.requiredNumber(),
    Title: schemaDefaults.requiredString(),
    Document_Type: z.nativeEnum(DocumentType),
    Procedure_Type: z.nativeEnum(ProcedureType),
    Template_UUID: schemaDefaults.requiredString(),
    Environment_UUID: schemaDefaults.requiredString(),
    Act_UUID: schemaDefaults.requiredString(),
    Module_Status_ID: schemaDefaults.requiredNumber(),
})

export const PUBLICATION_VERSION_ADD_SCHEMA = object({
    Module_Status_ID: schemaDefaults.requiredNumber(),
})

export const PUBLICATION_VERSION_EDIT_SCHEMA = object({
    Module_Status_ID: schemaDefaults.requiredNumber(),
    Effective_Date: schemaDefaults.optionalString
        .refine(date => {
            return date && new Date(date) > new Date(Date.now())
        }, 'De inwerkingtredingsdatum moet in de toekomst liggen')
        .nullable(),
    Announcement_Date: schemaDefaults.optionalString
        .refine(date => {
            return date && new Date(date) > new Date(Date.now())
        }, 'De bekendmakingsdatum moet in de toekomst liggen')
        .nullable(),
    Bill_Metadata: object({
        Official_Title: schemaDefaults.requiredString(),
    }),
    Bill_Compact: object({
        Preamble: schemaDefaults.optionalString,
        Amendment_Article: schemaDefaults.requiredString(),
        Time_Article: schemaDefaults.requiredString(),
        Custom_Articles: array(
            object({
                Label: schemaDefaults.requiredString(),
                Content: schemaDefaults.requiredString(),
            })
        ).optional(),
        Closing: schemaDefaults.optionalString,
        Signed: schemaDefaults.optionalString,
    }),
    Procedural: object({
        Enactment_Date: schemaDefaults.optionalString,
        Signed_Date: schemaDefaults.optionalString,
        Procedural_Announcement_Date: schemaDefaults.optionalString,
    }),
}).superRefine(({ Effective_Date, Announcement_Date }, ctx) => {
    if (
        Effective_Date &&
        Announcement_Date &&
        new Date(Announcement_Date) >= new Date(Effective_Date)
    ) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message:
                'De bekendmakingsdatum moet eerder zijn dan de inwerkingtredingsdatum',
            path: ['Announcement_Date'],
        })
    }
})

export const EMPTY_PUBLICATION_OBJECT = createEmptyObject(SCHEMA_PUBLICATION)
