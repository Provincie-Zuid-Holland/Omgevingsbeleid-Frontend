import { z } from 'zod'

import { DynamicSection } from '@/config/objects/types'
import { schemaDefaults } from '@/validation/zodSchema'

/**
 * Create SCHEMA based on provided dynamic sections
 */
const generateDynamicSchema = (sections: DynamicSection[]) => {
    let dynamicSchema = z.object({})

    sections.forEach(section => {
        section.fields.forEach(field => {
            switch (field.type) {
                case 'text':
                case 'textarea':
                case 'wysiwyg':
                case 'select':
                    return (dynamicSchema = dynamicSchema.extend({
                        [field.name]:
                            field.validation ||
                            ((field.required
                                ? schemaDefaults.requiredString()
                                : schemaDefaults.optionalString) as any),
                    }))
                default:
                    return dynamicSchema
            }
        })
    })

    return dynamicSchema
}

export { generateDynamicSchema }
