// @ts-nocheck

import { array, object, union } from 'zod'

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
            fields: [
                {
                    type: 'select',
                    label: 'Instrument',
                    description:
                        'Geef aan voor welk instrument dit template is.',
                    placeholder: 'Kies een instrument',
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
                    description:
                        'Formuleer in enkele woorden de titel van dit template.',
                    placeholder: "Bijv. 'Programma Herziening 2024 Definitief'",
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    description: 'Geef een omschrijving voor dit template.',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
        {
            fields: [
                {
                    name: 'Text_Template',
                    label: 'Text template',
                    description:
                        'Geef aan hoe de template er uit moet komen te zien voor de export. Je kunt hiervoor object templates gebruiken die je hieronder kan definiëren.',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
        {
            fields: [
                {
                    name: 'Object_Types',
                    type: 'select',
                    label: 'Object types',
                    description:
                        'Selecteer de object types die je gaat gebruiken voor het definiëren van hoe dit template eruit ziet.',
                    options: Object.keys(models)
                        .filter(model => !!!models[model].defaults.atemporal)
                        .map(model => ({
                            label: models[model].defaults.singularCapitalize,
                            value: models[model].defaults.singular,
                        })),
                    placeholder: 'Selecteer een of meerdere object types',
                    isMulti: true,
                    required: true,
                    validation: schemaDefaults.options,
                },
                {
                    name: 'Object_Templates',
                    arrayLabel: 'Object Template',
                    type: 'array',
                    fields: [
                        {
                            type: 'select',
                            placeholder: 'Selecteer een gebruikt object',
                            description:
                                'Geef per gebruikt object aan hoe het moet worden getoond in de export.',
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
            fields: [
                {
                    name: 'Object_Field_Map',
                    label: 'Field maps',
                    description: 'Geef per gebruikt object een field map',
                    arrayLabel: 'Field map',
                    type: 'array',
                    fields: [
                        {
                            type: 'select',
                            placeholder: 'Selecteer een gebruikt object type',
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
                            type: 'select',
                            placeholder: 'Vul een waarde in en druk op enter',
                            name: 'value',
                            required: true,
                            isMulti: true,
                            isCreatable: true,
                            menuIsOpen: false,
                            components: {
                                DropdownIndicator: null,
                            },
                        },
                    ],
                    validation: array(
                        object({
                            key: schemaDefaults.requiredString(),
                            value: union([
                                array(schemaDefaults.requiredString()),
                                array(
                                    object({
                                        label: schemaDefaults.requiredString(),
                                        value: schemaDefaults.requiredString(),
                                    })
                                ),
                            ]),
                        })
                    )
                        .optional()
                        .nullable(),
                },
            ],
        },
    ],
}

model.validationSchema = generateDynamicSchema(model.dynamicSections)

export default model
