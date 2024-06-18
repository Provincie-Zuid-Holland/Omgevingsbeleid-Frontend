import { object } from 'zod'

import { ModelPatchStaticType } from '@/config/objects/types'
import { getStaticDataPropertyRequired } from '@/utils/dynamicObject'
import { schemaDefaults, zodAlwaysRefine } from '@/validation/zodSchema'

/**
 * Create SCHEMA based on provided values
 */
const generateSchema = (values: (keyof ModelPatchStaticType)[]) => {
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
        // Cast data to a type with optional properties to handle the case where they might not exist
        const {
            Owner_1_UUID,
            Owner_2_UUID,
            Portfolio_Holder_1_UUID,
            Portfolio_Holder_2_UUID,
        } = data as {
            Owner_1_UUID?: string
            Owner_2_UUID?: string
            Portfolio_Holder_1_UUID?: string
            Portfolio_Holder_2_UUID?: string
        }

        if (!!Owner_1_UUID && !!Owner_2_UUID && Owner_1_UUID === Owner_2_UUID) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'De eerste en tweede eigenaar mogen niet dezelfde persoon zijn',
                path: ['Owner_1_UUID'],
            })

            ctx.addIssue({
                code: 'custom',
                message:
                    'De eerste en tweede eigenaar mogen niet dezelfde persoon zijn',
                path: ['Owner_2_UUID'],
            })
        }

        if (
            !!Portfolio_Holder_1_UUID &&
            !!Portfolio_Holder_2_UUID &&
            Portfolio_Holder_1_UUID === Portfolio_Holder_2_UUID
        ) {
            ctx.addIssue({
                code: 'custom',
                message:
                    'De eerste en tweede portefeuillehouder mogen niet dezelfde persoon zijn',
                path: ['Portfolio_Holder_1_UUID'],
            })

            ctx.addIssue({
                code: 'custom',
                message:
                    'De eerste en tweede portefeuillehouder mogen niet dezelfde persoon zijn',
                path: ['Portfolio_Holder_2_UUID'],
            })
        }
    })
}

export { generateSchema }
