import { CircleExclamation } from '@pzh-ui/icons'

import {
    useGetRevisionsVerplichtProgrammaVersion,
    useVerplichtProgrammaEditObjectStatic,
    useVerplichtProgrammaGetListActiveModuleObjects,
    useVerplichtProgrammaGetRelationsList,
    useVerplichtProgrammaListValidLineages,
    useVerplichtProgrammaListValidLineageTree,
    useVerplichtProgrammaPostModulePatchObject,
    useVerplichtProgrammaPostRelationsOverwrite,
    useVerplichtProgrammaViewGetObjectStatic,
    useVerplichtProgrammaViewModuleObjectLatest,
    useVerplichtProgrammaViewObjectLatest,
    useVerplichtProgrammaViewObjectVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject, ModelFetchers } from './types'

const fetchers: ModelFetchers = {
    useGetValid: useVerplichtProgrammaListValidLineages,
    useGetValidLineage: useVerplichtProgrammaListValidLineageTree,
    useGetVersion: useVerplichtProgrammaViewObjectVersion,
    useGetLatestLineage: useVerplichtProgrammaViewObjectLatest,
    useGetRevision: useGetRevisionsVerplichtProgrammaVersion,
    useGetRelations: useVerplichtProgrammaGetRelationsList,
    usePutRelations: useVerplichtProgrammaPostRelationsOverwrite,
    useGetLatestLineageInModule: useVerplichtProgrammaViewModuleObjectLatest,
    usePatchObjectInModule: useVerplichtProgrammaPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    useGetStatic: useVerplichtProgrammaViewGetObjectStatic,
    usePostStatic: useVerplichtProgrammaEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useVerplichtProgrammaGetListActiveModuleObjects,
}

const verplichtProgramma: DynamicObject = {
    defaults: {
        singular: 'verplicht_programma',
        singularReadable: 'verplicht programma',
        singularCapitalize: 'Verplicht programma',
        plural: 'verplichte-programmas',
        pluralReadable: "verplichte programma's",
        pluralCapitalize: "Verplichte programma's",
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        demonstrativeSingular: 'verplichte programma',
        slugOverview: 'omgevingsprogramma',
        slugOverviewPublic: true,
        icon: CircleExclamation,
    },
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Owner_3_UUID',
        'Portfolio_Holder_1_UUID',
    ],
    fetchers,
    allowedConnections: [{ key: 'Maatregelen', type: 'maatregel' }],
    dynamicSections: [
        {
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van het verplicht programma.',
                    placeholder: "Bijv. 'Regionaal waterprogramma'",
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Description',
                    label: 'Omschrijving',
                    description:
                        'Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
                    type: 'wysiwyg',
                    customMenuOptions: ['heading'],
                    required: true,
                },
            ],
        },
    ],
}

verplichtProgramma.validationSchema = generateDynamicSchema(
    verplichtProgramma.dynamicSections
)

export default verplichtProgramma
