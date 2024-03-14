// @ts-nocheck

import { array, object } from 'zod'

import { DocumentType, TemplateEdit } from '@/api/fetchers.schemas'
import { DynamicObject } from '@/config/objects/types'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import * as models from '../objects'

const model: DynamicObject<any, keyof TemplateEdit> = {
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
    },
    dynamicSections: [
        {
            title: 'Instrument, titel en omschrijving',
            description:
                'Geef aan voor welk instrument dit template is, en geef er een titel en omschrijving aan',
            fields: [
                {
                    type: 'select',
                    label: 'Instrument',
                    placeholder: 'Kies het instrument',
                    name: 'Document_Type',
                    options: Object.keys(DocumentType).map(type => ({
                        label: type,
                        value: type,
                    })),
                    required: true,
                },
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    type: 'textarea',
                    required: true,
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
                    required: true,
                },
            ],
        },
        {
            title: 'Object types',
            description: 'Selecteer een of meerdere object types.',
            fields: [
                {
                    name: 'Object_Types',
                    type: 'select',
                    label: 'Object types',
                    options: Object.keys(models)
                        .filter(model => !!!models[model].defaults.atemporal)
                        .map(model => ({
                            label: models[model].defaults.singularCapitalize,
                            value: models[model].defaults.singular,
                        })),
                    placeholder: 'Selecteer een of meerdere object types',
                    isMulti: true,
                    required: true,
                    validation: array(schemaDefaults.requiredString(), {
                        required_error: 'Dit veld is verplicht.',
                        invalid_type_error: 'Dit veld is verplicht.',
                    }),
                },
            ],
        },
        {
            title: 'Object template',
            description:
                'Geef per gebruikt object aan hoe het moet worden getoond in de export.',
            fields: [
                {
                    name: 'Object_Templates',
                    arrayLabel: 'Object Template',
                    type: 'array',
                    fields: [
                        {
                            type: 'select',
                            placeholder: 'key',
                            name: 'key',
                            required: true,
                            options: Object.keys(models)
                                .filter(
                                    model => !!!models[model].defaults.atemporal
                                )
                                .map(model => ({
                                    label: models[model].defaults
                                        .singularCapitalize,
                                    value: models[model].defaults.singular,
                                })),
                        },
                        {
                            type: 'textarea',
                            placeholder: 'value',
                            name: 'value',
                            required: true,
                        },
                    ],
                    validation: array(
                        object({
                            key: schemaDefaults.requiredString(),
                            value: schemaDefaults.requiredString(),
                        })
                    ),
                },
            ],
        },
        {
            title: 'Field map',
            fields: [
                {
                    name: 'Field_Map',
                    type: 'select',
                    label: 'Field map',
                    placeholder: 'Vul een waarde in en druk op enter',
                    isMulti: true,
                    validation: array(schemaDefaults.requiredString(), {
                        required_error: 'Dit veld is verplicht.',
                        invalid_type_error: 'Dit veld is verplicht.',
                    }),
                    isCreatable: true,
                    menuIsOpen: false,
                    components: {
                        DropdownIndicator: null,
                    },
                    required: true,
                },
            ],
        },
    ],
}

model.validationSchema = generateDynamicSchema(model.dynamicSections)

export default model
