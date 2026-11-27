import { AngleDown, CircleExclamation } from '@pzh-ui/icons'

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
                {
                    name: 'Target_Codes',
                    label: 'Maatregelen',
                    type: 'search',
                    isMulti: true,
                    placeholder: 'Zoek op maatregelen',
                    filterParams: {
                        object_types: ['maatregel'],
                    },
                    filterOnModule: true,
                    objectKey: 'Object_Code',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    required: true,
                    validation: schemaDefaults.options,
                },
                {
                    name: 'Themas',
                    label: "Thema's",
                    description:
                        "Om het verplichte programma beter vindbaar te maken in de landelijke voorziening kun je het verplichte programma voorzien van één of meerdere thema's.",
                    type: 'theme',
                    placeholder: 'Kies één of meerdere thema’s',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                },
                {
                    name: 'Hoofdlijnen',
                    label: 'Hoofdlijnen',
                    description: (
                        <>
                            Om het verplichte programma beter vindbaar te maken
                            door middel van annotaties in de landelijke
                            voorziening kun je het verplichte programma voorzien
                            van één of meerdere hoofdlijnen. Indien een nieuwe
                            hoofdlijn gewenst is, neem dan contact op met{' '}
                            <a
                                href="mailto:teamomgevingsbeleid@pzh.nl"
                                className="underline">
                                teamomgevingsbeleid@pzh.nl
                            </a>
                            .
                        </>
                    ),
                    type: 'annotation',
                    placeholder: 'Kies één of meerdere hoofdlijnen',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                },
            ],
        },
    ],
}

verplichtProgramma.validationSchema = generateDynamicSchema(
    verplichtProgramma.dynamicSections
)

export default verplichtProgramma
