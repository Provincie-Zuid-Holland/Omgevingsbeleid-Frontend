import { array, object, tuple, ZodIssueCode } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const PUBLICATION_SCHEMA = object({
    Document_Type: schemaDefaults.requiredString(),
    Official_Title: schemaDefaults.requiredString(),
    Regulation_Title: schemaDefaults.requiredString(),
    Template_ID: schemaDefaults.optionalNumber,
})

export const PUBLICATION_VERSION_SCHEMA = object({
    Is_Official: schemaDefaults.requiredString(),
    Procedure_Type: schemaDefaults.requiredString(),
    Module_Status_ID: schemaDefaults.requiredNumber(),
    PZH_Bill_Identifier: schemaDefaults.optionalString,
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
    Bill_Data: object({
        Preamble: schemaDefaults.optionalString,
        Amendment_Article: object({
            Label: schemaDefaults.requiredString(),
            Number: schemaDefaults.optionalString,
            Content: schemaDefaults.optionalString,
        }).optional(),
        Articles: array(
            object({
                Label: schemaDefaults.requiredString(),
                Number: schemaDefaults.optionalString,
                Content: schemaDefaults.optionalString,
            })
        ).optional(),
        Time_Article: object({
            Label: schemaDefaults.requiredString(),
            Number: schemaDefaults.optionalString,
            Content: schemaDefaults.optionalString,
        }).optional(),
        Closing: schemaDefaults.requiredString(),
        Signature: schemaDefaults.requiredString(),
    }),
    Procedure_Data: object({
        Announcement_Date: schemaDefaults.requiredString().refine(date => {
            return new Date(date) > new Date(Date.now())
        }, 'De bekendmakingsdatum moet in de toekomst liggen'),
        Steps: tuple([
            object({
                Step_Type: schemaDefaults.requiredString(),
                Conclusion_Date: schemaDefaults.requiredString(),
            }),
            object({
                Step_Type: schemaDefaults.requiredString(),
                Conclusion_Date: schemaDefaults.requiredString(),
            }),
        ]),
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
