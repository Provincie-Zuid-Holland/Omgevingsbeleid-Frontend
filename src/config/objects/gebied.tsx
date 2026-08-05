import { DrawPolygon } from '@pzh-ui/icons'

import {
    useGebiedEditObjectStatic,
    useGebiedGetListActiveModuleObjects,
    useGebiedListValidLineageTree,
    useGebiedListValidLineages,
    useGebiedPostModulePatchObject,
    useGebiedViewGetObjectStatic,
    useGebiedViewModuleObjectLatest,
    useGebiedViewObjectLatest,
    useGebiedViewObjectVersion,
    useGetRevisionsGebiedVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useGebiedListValidLineages,
    useGetValidLineage: useGebiedListValidLineageTree,
    useGetVersion: useGebiedViewObjectVersion,
    useGetLatestLineage: useGebiedViewObjectLatest,
    useGetRevision: useGetRevisionsGebiedVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useGebiedViewModuleObjectLatest,
    usePatchObjectInModule: useGebiedPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    useGetStatic: useGebiedViewGetObjectStatic,
    usePostStatic: useGebiedEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useGebiedGetListActiveModuleObjects,
}

const gebied: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'gebied',
        singularReadable: 'gebied',
        singularCapitalize: 'Gebied',
        plural: 'gebieden',
        pluralReadable: 'gebieden',
        pluralCapitalize: 'Gebieden',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'deze',
        icon: DrawPolygon,
        disabled: true,
        hideFromModuleFilter: true,
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    fetchers,
    dynamicSections: [
        {
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van het gebied.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
            ],
        },
    ],
}

gebied.validationSchema = generateDynamicSchema(gebied.dynamicSections)

export default gebied
