import { RegulationCreate } from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { Regulation } from './types'

const taak: Regulation<keyof RegulationCreate> = {
    defaults: {
        regulationType: 'Wettelijke taken en bevoegdheden',
        singular: 'taak',
        singularCapitalize: 'Wettelijke taak',
        plural: 'taken',
        pluralCapitalize: 'Wettelijke taken',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
    },
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'Formuleer in enkele woorden de titel van de wettelijke taak.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                // {
                //     name: 'Type',
                //     label: 'Link naar wetten.nl',
                //     type: 'url',
                //     required: true,
                //     validation: schemaDefaults.url(),
                // },
            ],
        },
    ],
}

taak.validationSchema = generateDynamicSchema(taak.dynamicSections)

export default taak
