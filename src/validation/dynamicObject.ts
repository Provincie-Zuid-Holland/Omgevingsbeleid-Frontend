import { object } from 'zod'

import { DynamicSection } from '@/config/types'
import { schemaDefaults } from '@/validation/zodSchema'

/**
 * Create SCHEMA based on provided dynamic sections
 */
const generateDynamicSchema = (sections: DynamicSection[]) => {
    let dynamicSchema = object({})

    sections.forEach(section => {
        section.fields.forEach(field => {
            switch (field.type) {
                case 'text':
                case 'textarea':
                case 'wysiwyg':
                case 'select':
                case 'image':
                    return (dynamicSchema = dynamicSchema.extend({
                        [field.name]:
                            field.validation ||
                            ((field.required
                                ? schemaDefaults.requiredString()
                                : schemaDefaults.optionalString) as any),
                    }))
                case 'url':
                    return (dynamicSchema = dynamicSchema.extend({
                        [field.name]:
                            field.validation ||
                            ((field.required
                                ? schemaDefaults.url()
                                : schemaDefaults.optionalUrl) as any),
                    }))
                default:
                    return dynamicSchema
            }
        })
    })

    return dynamicSchema
}

export { generateDynamicSchema }
