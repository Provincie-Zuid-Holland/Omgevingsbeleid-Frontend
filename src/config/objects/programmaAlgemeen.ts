import { ListCheck } from '@pzh-ui/icons'

import {
    useGetRevisionsProgrammaAlgemeenVersion,
    useProgrammaAlgemeenEditObjectStatic,
    useProgrammaAlgemeenGetListActiveModuleObjects,
    useProgrammaAlgemeenListValidLineages,
    useProgrammaAlgemeenListValidLineageTree,
    useProgrammaAlgemeenPostModulePatchObject,
    useProgrammaAlgemeenViewModuleObjectLatest,
    useProgrammaAlgemeenViewObjectLatest,
    useProgrammaAlgemeenViewObjectVersion,
} from '@/api/fetchers'
import {
    VisieAlgemeenPatch,
    VisieAlgemeenStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useProgrammaAlgemeenListValidLineages,
    useGetValidLineage: useProgrammaAlgemeenListValidLineageTree,
    useGetVersion: useProgrammaAlgemeenViewObjectVersion,
    useGetLatestLineage: useProgrammaAlgemeenViewObjectLatest,
    useGetRevision: useGetRevisionsProgrammaAlgemeenVersion,
    useGetRelations: null,
    usePutRelations: null,
    useGetLatestLineageInModule: useProgrammaAlgemeenViewModuleObjectLatest,
    usePatchObjectInModule: useProgrammaAlgemeenPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useProgrammaAlgemeenEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useProgrammaAlgemeenGetListActiveModuleObjects,
}

const programmaAlgemeen: DynamicObject<
    typeof fetchers,
    keyof VisieAlgemeenPatch,
    (keyof VisieAlgemeenStaticPostStatics)[]
> = {
    defaults: {
        singular: 'programma_algemeen',
        singularReadable: 'programma algemeen',
        singularCapitalize: 'Programma algemeen',
        plural: 'programmas-algemeen',
        pluralCapitalize: "Programma's algemeen",
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        slugOverview: 'omgevingsprogramma',
        icon: ListCheck,
        hideBreadcrumbs: true,
        parentType: 'Programma',
    },
    staticData: ['Owner_1_UUID', 'Owner_2_UUID'],
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot het programma algemeen kwijt.',
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

programmaAlgemeen.validationSchema = generateDynamicSchema(
    programmaAlgemeen.dynamicSections
)

export default programmaAlgemeen
