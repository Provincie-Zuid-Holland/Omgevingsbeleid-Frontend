import { array, object } from 'zod'

import { schemaDefaults } from './zodSchema'

export const ANNOUNCEMENT_EDIT_SCHEMA = object({
    Metadata: object({
        Official_Title: schemaDefaults.requiredString(),
    }),
    Content: object({
        Texts: array(
            object({
                Title: schemaDefaults.requiredString(),
                Description: schemaDefaults.requiredString(),
            })
        ),
    }),
    Announcement_Date: schemaDefaults.requiredString(),
    Procedural: object({
        Begin_Inspection_Period_Date: schemaDefaults.requiredString(),
        End_Inspection_Period_Date: schemaDefaults.requiredString(),
    }),
})
