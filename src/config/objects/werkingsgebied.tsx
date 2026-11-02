import { DrawPolygon } from '@pzh-ui/icons'

import { ZodIssueCode } from 'zod'

import {
    useGetRevisionsWerkingsgebiedVersion,
    useWerkingsgebiedEditObjectStatic,
    useWerkingsgebiedGetListActiveModuleObjects,
    useWerkingsgebiedListValidLineages,
    useWerkingsgebiedListValidLineageTree,
    useWerkingsgebiedPostModulePatchObject,
    useWerkingsgebiedViewGetObjectStatic,
    useWerkingsgebiedViewModuleObjectLatest,
    useWerkingsgebiedViewObjectLatest,
    useWerkingsgebiedViewObjectVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject, ModelFetchers } from './types'

const fetchers: ModelFetchers = {
    useGetValid: useWerkingsgebiedListValidLineages,
    useGetValidLineage: useWerkingsgebiedListValidLineageTree,
    useGetVersion: useWerkingsgebiedViewObjectVersion,
    useGetLatestLineage: useWerkingsgebiedViewObjectLatest,
    useGetRevision: useGetRevisionsWerkingsgebiedVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useWerkingsgebiedViewModuleObjectLatest,
    usePatchObjectInModule: useWerkingsgebiedPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    useGetStatic: useWerkingsgebiedViewGetObjectStatic,
    usePostStatic: useWerkingsgebiedEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useWerkingsgebiedGetListActiveModuleObjects,
}

const werkingsgebied: DynamicObject = {
    defaults: {
        singular: 'werkingsgebied',
        singularReadable: 'werkingsgebied',
        singularCapitalize: 'Werkingsgebied',
        plural: 'werkingsgebieden',
        pluralReadable: 'werkingsgebieden',
        pluralCapitalize: 'Werkingsgebieden',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        icon: DrawPolygon,
    },
    staticData: ['owner_1_id', 'owner_2_id'],
    fetchers,
    dynamicSections: [
        {
            fields: [
                {
                    name: 'title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'description',
                    label: 'Omschrijving',
                    type: 'wysiwyg',
                    customMenuOptions: ['heading'],
                },
                {
                    name: 'area_id',
                    label: 'Bron',
                    type: 'area',
                    placeholder:
                        'Zoek een werkingsgebied op naam of de naam van een versie',
                },
            ],
        },
    ],
    hasRelatedObjects: true,
}

werkingsgebied.validationSchema = generateDynamicSchema(
    werkingsgebied.dynamicSections
).superRefine(({ title, source_title }: any, ctx) => {
    if (!!source_title && title !== source_title) {
        ctx.addIssue({
            code: ZodIssueCode.custom,
            message:
                'De titel moet overeen komen met de titel van de gekozen bron',
            path: ['title'],
        })
    }
})

export default werkingsgebied
