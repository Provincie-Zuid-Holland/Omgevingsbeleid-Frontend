import { object, z } from 'zod'

import { AreaDesignationTypeEnum } from '@/api/fetchers.schemas'

import { schemaDefaults } from './zodSchema'

export const SCHEMA_OBJECT_ANNOTATE_AREA = object({
    group: schemaDefaults.requiredString(),
    type: z.nativeEnum(AreaDesignationTypeEnum, {
        errorMap: () => {
            return { message: 'Het veld is niet (goed) ingevuld.' }
        },
    }),
    location: schemaDefaults.requiredString(),
    label: schemaDefaults.requiredString(),
    id: schemaDefaults.requiredString(),
})
