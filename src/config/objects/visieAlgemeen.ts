import { EyeLight } from '@pzh-ui/icons'

import {
    useGetRevisionsVisieAlgemeenVersion,
    useVisieAlgemeenEditObjectStatic,
    useVisieAlgemeenGetListActiveModuleObjects,
    useVisieAlgemeenListValidLineages,
    useVisieAlgemeenListValidLineageTree,
    useVisieAlgemeenPostModulePatchObject,
    useVisieAlgemeenViewModuleObjectLatest,
    useVisieAlgemeenViewObjectLatest,
    useVisieAlgemeenViewObjectVersion,
} from '@/api/fetchers'
import {
    VisieAlgemeenPatch,
    VisieAlgemeenStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useVisieAlgemeenListValidLineages,
    useGetValidLineage: useVisieAlgemeenListValidLineageTree,
    useGetVersion: useVisieAlgemeenViewObjectVersion,
    useGetLatestLineage: useVisieAlgemeenViewObjectLatest,
    useGetRevision: useGetRevisionsVisieAlgemeenVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useVisieAlgemeenViewModuleObjectLatest,
    usePatchObjectInModule: useVisieAlgemeenPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useVisieAlgemeenEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useVisieAlgemeenGetListActiveModuleObjects,
}

const visieAlgemeen: DynamicObject<
    typeof fetchers,
    keyof VisieAlgemeenPatch,
    (keyof VisieAlgemeenStaticPostStatics)[]
> = {
    defaults: {
        singular: 'visie_algemeen',
        singularReadable: 'visie algemeen',
        singularCapitalize: 'Visie',
        plural: 'visies-algemeen',
        pluralCapitalize: 'Visies algemeen',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        slugOverview: 'omgevingsvisie',
        icon: EyeLight,
        slugOverviewPublic: true,
        parentType: 'Visie',
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de visie algemeen kwijt.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Inhoud',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: [
                        'image',
                        'heading',
                        'subscript',
                        'superscript',
                        'table',
                    ],
                    imageOptions: {
                        maxSize: 819200,
                    },
                },
            ],
        },
    ],
}

visieAlgemeen.validationSchema = generateDynamicSchema(
    visieAlgemeen.dynamicSections
)

export default visieAlgemeen
