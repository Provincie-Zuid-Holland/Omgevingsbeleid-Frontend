import { array, boolean, object, z, ZodIssueCode } from 'zod'

import { DocumentType, ProcedureType } from '@/api/fetchers.schemas'
import createEmptyObject from '@/utils/createEmptyObject'
import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_PUBLICATION = object({
    module_id: schemaDefaults.requiredNumber(),
    title: schemaDefaults.requiredString(),
    document_type: z.nativeEnum(DocumentType),
    procedure_type: z.nativeEnum(ProcedureType),
    template_id: schemaDefaults.requiredString(),
    environment_id: schemaDefaults.requiredString(),
    act_id: schemaDefaults.requiredString(),
    module_status_id: schemaDefaults.requiredNumber(),
})

export const PUBLICATION_EDIT_SCHEMA = object({
    template_id: schemaDefaults.requiredString(),
})

export const PUBLICATION_ADD_SCHEMA = object({
    act_id: schemaDefaults.requiredString(),
    template_id: schemaDefaults.requiredString(),
    module_status_id: schemaDefaults.requiredNumber(),
})

export const PUBLICATION_VERSION_ADD_SCHEMA = object({
    module_status_id: schemaDefaults.requiredNumber(),
})

export const PUBLICATION_VERSION_EDIT_SCHEMA = object({
    module_status_id: schemaDefaults.requiredNumber(),
    bill_metadata: object({
        official_title: schemaDefaults.requiredString(),
        quote_title: schemaDefaults.requiredString(),
    }),
    bill_compact: object({
        preamble: schemaDefaults.optionalRte(),
        amendment_article: schemaDefaults.requiredString(),
        time_article: schemaDefaults.rte(),
        custom_articles: array(
            object({
                number: schemaDefaults.requiredString(),
                content: schemaDefaults.rte(),
            })
        )
            .optional()
            .nullable(),
        appendices: array(
            object({
                number: schemaDefaults.requiredString(),
                title: schemaDefaults.requiredString(),
                content: schemaDefaults.rte(),
            })
        )
            .optional()
            .nullable(),
        motivation: z.preprocess(
            value => {
                const motivation = value as {
                    title?: string | null
                    content?: string | null
                    appendices?: unknown[] | null
                } | null

                const title = motivation?.title?.trim()
                const content = motivation?.content?.trim()
                const appendices = motivation?.appendices ?? []

                if (!title && !content && appendices.length === 0) {
                    return null
                }

                return value
            },
            object({
                title: schemaDefaults.requiredString(),
                content: schemaDefaults.rte(),
                appendices: array(
                    object({
                        number: schemaDefaults.requiredString(),
                        title: schemaDefaults.requiredString(),
                        content: schemaDefaults.rte(),
                    })
                )
                    .optional()
                    .nullable(),
            })
                .optional()
                .nullable()
        ),
        closing: schemaDefaults.optionalRte(),
        signed: schemaDefaults.optionalRte(),
    }),
    effective_date: z.preprocess(
        value => (value === '' ? null : value),
        schemaDefaults.optionalString.nullable().refine(date => {
            return !date || new Date(date) > new Date()
        }, 'De inwerkingtredingsdatum moet in de toekomst liggen')
    ),
    announcement_date: schemaDefaults.optionalString
        .refine(date => {
            return !date || new Date(date) > new Date()
        }, 'De bekendmakingsdatum moet in de toekomst liggen')
        .nullable(),
    procedural: object({
        enactment_date: schemaDefaults.optionalString,
        signed_date: schemaDefaults.optionalString,
        procedural_announcement_date: schemaDefaults.optionalString,
    }),
}).superRefine(({ effective_date, announcement_date }, ctx) => {
    if (
        effective_date &&
        announcement_date &&
        new Date(announcement_date) >= new Date(effective_date)
    ) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message:
                'De bekendmakingsdatum moet eerder zijn dan de inwerkingtredingsdatum',
            path: ['announcement_date'],
        })
    }
})

export const PUBLICATION_VERSION_ATTACHMENT_SCHEMA = object({
    title: schemaDefaults.requiredString(),
    uploaded_file: schemaDefaults.file,
    ignore_report: boolean().optional(),
})

export const EMPTY_PUBLICATION_OBJECT = createEmptyObject(SCHEMA_PUBLICATION)
