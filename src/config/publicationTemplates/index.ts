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
                {
                    name: 'Text_Template',
                    label: 'Text template',
                    type: 'textarea',
                    required: true,
                },
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
                        required_error: 'Het veld is niet (goed) ingevuld.',
                        invalid_type_error: 'Het veld is niet (goed) ingevuld.',
                    }),
                },
                {
                    name: 'Object_Templates',
                    arrayLabel: 'Object Template',
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
