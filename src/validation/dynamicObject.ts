import { z } from 'zod'

import { DynamicSection } from '@/config/objects/types'
import { schemaDefaults } from '@/utils/zodSchema'

/**
 * SCHEMA containing default fields for each object type
 */
const SCHEMA = z.object({
    Title: schemaDefaults.title,
})

const DESCRIPTION_SCHEMA = z.object({
    Description: schemaDefaults.requiredString(),
})

/**
 * Extend SCHEMA based on provided dynamic sections
 */
const generateDynamicSchema = (sections: DynamicSection[]) => {
    let dynamicSchema = SCHEMA

    sections.forEach(section => {
        switch (section.type) {
            case 'description':
                return (dynamicSchema = dynamicSchema.merge(DESCRIPTION_SCHEMA))
            default:
                return dynamicSchema
        }
    })

    return dynamicSchema
}

export { generateDynamicSchema }
