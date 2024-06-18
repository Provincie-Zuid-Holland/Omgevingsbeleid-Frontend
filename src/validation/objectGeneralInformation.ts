import { object } from 'zod'

import { schemaDefaults } from '@/validation/zodSchema'

export const SCHEMA_GENERAL_INFORMATION = object({
    Client_1_UUID: schemaDefaults.optionalString,
    Owner_1_UUID: schemaDefaults.requiredString(),
    Owner_2_UUID: schemaDefaults.optionalString,
    Portfolio_Holder_1_UUID: schemaDefaults.optionalString,
    Portfolio_Holder_2_UUID: schemaDefaults.optionalString,
}).superRefine(
    (
        {
            Owner_1_UUID,
            Owner_2_UUID,
            Portfolio_Holder_1_UUID,
            Portfolio_Holder_2_UUID,
        },
        ctx
    ) => {
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
    }
)
