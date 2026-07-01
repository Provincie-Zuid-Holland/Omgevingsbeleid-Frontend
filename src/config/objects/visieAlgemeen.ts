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

const visieAlgemeen: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'visie_algemeen',
        singularReadable: 'visie algemeen',
        singularCapitalize: 'Visie',
        plural: 'visies-algemeen',
        pluralReadable: 'visies algemeen',
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
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formulier in enkele woorden de titel van het visie algemeen.',
                    placeholder: "Bijv. '3. Hier staat Zuid-Holland nu'",
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Inhoud',
                    description:
                        'Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: [
                        'heading',
                        'image',
                        'subscript',
                        'superscript',
                        'table',
                    ],
                    imageOptions: {
                        options: {
                            allowBase64: true,
                            inline: true,
                        },
                        uploadOptions: {
                            maxSize: 819200,
                        },
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
