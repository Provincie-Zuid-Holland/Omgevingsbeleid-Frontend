import { RegulationCreate } from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { Regulation } from './types'

const belang: Regulation<keyof RegulationCreate> = {
    defaults: {
        regulationType: 'Nationaal Belang',
        singular: 'belang',
        singularCapitalize: 'Nationaal belang',
        plural: 'belangen',
        pluralCapitalize: 'Nationale belangen',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
    },
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'Formuleer in enkele woorden de titel van het nationale belang.',
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

belang.validationSchema = generateDynamicSchema(belang.dynamicSections)

export default belang
