import { object, RefinementCtx } from 'zod'

import { ObjectStaticShort } from '@/api/fetchers.schemas'
import {
    getStaticDataPropertyRequired,
    ownerFields,
} from '@/utils/dynamicObject'
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

    return zodAlwaysRefine(schema).superRefine(validateDistinctOwners)
}

const validateDistinctOwners = (
    data: ObjectStaticShort,
    ctx: RefinementCtx
) => {
    for (const field of ownerFields) {
        const owner = data[field]

        if (
            owner &&
            ownerFields.some(other => other !== field && data[other] === owner)
        ) {
            ctx.addIssue({
                code: 'custom',
                message: 'Kies voor elk eigenaarsveld een andere persoon.',
                path: [field],
            })
        }
    }
}

export { generateSchema, validateDistinctOwners }
