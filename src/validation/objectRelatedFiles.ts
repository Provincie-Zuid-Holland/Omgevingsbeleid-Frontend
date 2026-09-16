import { boolean, object } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ALLOWED_FILE_TYPE = 'application/pdf'

export const OBJECT_RELATED_FILE_ADD_SCHEMA = object({
    title: schemaDefaults.requiredString(),
    uploaded_file: schemaDefaults.file
        .refine(
            file => file.type === ALLOWED_FILE_TYPE,
            'Alleen PDF-bestanden zijn toegestaan'
        )
        .refine(
            file => file.size <= MAX_FILE_SIZE,
            'Het bestand mag maximaal 20MB groot zijn'
        ),
    ignore_report: boolean().optional(),
})
