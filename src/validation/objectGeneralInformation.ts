import { object } from 'zod'

import { ObjectStaticShort } from '@/api/fetchers.schemas'
import { getStaticDataPropertyRequired } from '@/utils/dynamicObject'
import { schemaDefaults, zodAlwaysRefine } from '@/validation/zodSchema'

/**
 * Create SCHEMA based on provided values
 */
const generateSchema = (values: (keyof ObjectStaticShort)[]) => {
    let schema = object({})

    values.forEach(val => {
        const required = getStaticDataPropertyRequired(val)

        return (schema = schema.extend({
            [val]: required
                ? schemaDefaults.requiredString()
                : schemaDefaults.optionalString,
        }))
    })

    return zodAlwaysRefine(schema).superRefine((data, ctx) => {
        const owners = data as Partial<Record<keyof ObjectStaticShort, string>>
        const ownerKeys = ['owner_1_id', 'owner_2_id', 'owner_3_id'] as const

        ownerKeys.forEach(key => {
            const value = owners[key]
            if (
                value &&
                ownerKeys.some(
                    other => other !== key && owners[other] === value
                )
            ) {
                ctx.addIssue({
                    code: 'custom',
                    message: 'De eigenaren mogen niet dezelfde persoon zijn',
                    path: [key],
                })
            }
        })
    })
}

export { generateSchema }
