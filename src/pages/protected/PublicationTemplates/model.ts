// @ts-nocheck
import { CalendarCheck } from '@pzh-ui/icons'

import { Model } from '@/config/objects/types'
import { schemaDefaults } from '@/validation/zodSchema'

export const model: Model = {
    defaults: {
        singular: 'publicatietemplate',
        singularReadable: 'publicatietemplate',
        singularCapitalize: 'Publicatietemplate',
        plural: 'publicatietemplates',
        pluralCapitalize: 'Publicatietemplates',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        icon: CalendarCheck,
    },
    dynamicSections: [
        {
            title: 'Instrument, titel en omschrijving',
            description:
                'Geef aan voor welk instrument dit template is, en geef er een titel en omschrijving aan',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    type: 'select',
                    label: 'Instrument',
                    placeholder: 'Kies het instrument',
                    name: 'Instrument',
                    options: [
                        { label: 'Visie', value: 'Visie' },
                        { label: 'Programma', value: 'Programma' },
                    ],
                    required: true,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    type: 'textarea',
                },
            ],
        },
        {
            title: 'Text template',
            description:
                'Geef aan hoe de template er uit moet komen te zien voor de export. Je kunt hier object templates gebruiken. Deze moet je hieronder definiëren.',
            fields: [
                {
                    name: 'Text_Template',
                    label: 'Text template',
                    type: 'textarea',
                },
            ],
        },
        {
            title: 'Object template',
            description:
                'Geef per gebruikt object aan hoe het moet worden getoond in de export.',
            fields: [
                {
                    name: 'Object_Template',
                    arrayLabel: 'Object Template',
                    type: 'array',
                    fields: [
                        {
                            type: 'text',
                            placeholder: 'key',
                            name: 'Key',
                        },
                        {
                            type: 'textarea',
                            placeholder: 'value',
                            name: 'Value',
                        },
                    ],
                },
            ],
        },
    ],
}
