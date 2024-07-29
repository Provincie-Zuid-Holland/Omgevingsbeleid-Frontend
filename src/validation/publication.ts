import { array, object, ZodIssueCode } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const PUBLICATION_SCHEMA = object({
    Title: schemaDefaults.requiredString(),
    Document_Type: schemaDefaults.requiredString(),
    Template_UUID: schemaDefaults.requiredString(),
})

export const PUBLICATION_VERSION_ADD_SCHEMA = object({
    Module_Status_ID: schemaDefaults.requiredNumber(),
})

export const PUBLICATION_VERSION_EDIT_SCHEMA = (isRequired?: boolean) =>
    object({
        Module_Status_ID: schemaDefaults.requiredNumber(),
        Effective_Date: isRequired
            ? schemaDefaults.requiredString().refine(date => {
                  return date && new Date(date) > new Date(Date.now())
              }, 'De inwerkingtredingsdatum moet in de toekomst liggen')
            : schemaDefaults.optionalString
                  .refine(date => {
                      return date && new Date(date) > new Date(Date.now())
                  }, 'De inwerkingtredingsdatum moet in de toekomst liggen')
                  .nullable(),
        Announcement_Date: isRequired
            ? schemaDefaults.requiredString().refine(date => {
                  return date && new Date(date) > new Date(Date.now())
              }, 'De bekendmakingsdatum moet in de toekomst liggen')
            : schemaDefaults.optionalString
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
            Signed_Date: isRequired
                ? schemaDefaults.requiredString()
                : schemaDefaults.optionalString,
            Procedural_Announcement_Date: isRequired
                ? schemaDefaults.requiredString()
                : schemaDefaults.optionalString,
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
