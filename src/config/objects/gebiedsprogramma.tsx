import { Hyperlink } from '@pzh-ui/components'
import { LocationDot } from '@pzh-ui/icons'

import { Link } from 'react-router-dom'

import {
    useGebiedsprogrammaEditObjectStatic,
    useGebiedsprogrammaGetListActiveModuleObjects,
    useGebiedsprogrammaGetRelationsList,
    useGebiedsprogrammaListValidLineages,
    useGebiedsprogrammaListValidLineageTree,
    useGebiedsprogrammaPostModulePatchObject,
    useGebiedsprogrammaPostRelationsOverwrite,
    useGebiedsprogrammaViewGetObjectStatic,
    useGebiedsprogrammaViewModuleObjectLatest,
    useGebiedsprogrammaViewObjectLatest,
    useGebiedsprogrammaViewObjectVersion,
    useGetRevisionsGebiedsprogrammaVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject, ModelFetchers } from './types'

const fetchers: ModelFetchers = {
    useGetValid: useGebiedsprogrammaListValidLineages,
    useGetValidLineage: useGebiedsprogrammaListValidLineageTree,
    useGetVersion: useGebiedsprogrammaViewObjectVersion,
    useGetLatestLineage: useGebiedsprogrammaViewObjectLatest,
    useGetRevision: useGetRevisionsGebiedsprogrammaVersion,
    useGetRelations: useGebiedsprogrammaGetRelationsList,
    usePutRelations: useGebiedsprogrammaPostRelationsOverwrite,
    useGetLatestLineageInModule: useGebiedsprogrammaViewModuleObjectLatest,
    usePatchObjectInModule: useGebiedsprogrammaPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    useGetStatic: useGebiedsprogrammaViewGetObjectStatic,
    usePostStatic: useGebiedsprogrammaEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useGebiedsprogrammaGetListActiveModuleObjects,
}

const gebiedsprogramma: DynamicObject = {
    defaults: {
        singular: 'gebiedsprogramma',
        singularReadable: 'gebiedsprogramma',
        singularCapitalize: 'Gebiedsprogramma',
        plural: 'gebiedsprogrammas',
        pluralReadable: "gebiedsprogramma's",
        pluralCapitalize: "Gebiedsprogramma's",
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        slugOverview: 'omgevingsprogramma',
        slugOverviewPublic: true,
        description:
            'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.',
        icon: LocationDot,
        parentType: 'Programma',
    },
    staticData: [
        'client_1_id',
        'owner_1_id',
        'owner_2_id',
        'owner_3_id',
        'portfolio_holder_1_id',
    ],

    allowedConnections: [{ type: 'maatregel', key: 'maatregelen' }],
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            gebiedsprogramma is veelal gekoppeld met maatregelen. Hieronder een
            overzicht van de maatregelen van dit gebiedsprogramma. Bekijk voor
            het volledige overzicht het{' '}
            <Hyperlink asChild>
                <Link to="/beleidsnetwerk">beleidsnetwerk</Link>
            </Hyperlink>
            .
        </>
    ),
    fetchers,
    dynamicSections: [
        {
            fields: [
                {
                    name: 'title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van het gebiedsprogramma.',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'description',
                    label: 'Omschrijving',
                    description:
                        'Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct wat de provincie gaat doen en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
                    type: 'wysiwyg',
                    customMenuOptions: ['heading'],
                    required: true,
                },
                {
                    name: 'image',
                    label: 'Afbeelding van het gebied',
                    type: 'image',
                    maxSize: 819200,
                    maxFiles: 1,
                    preview: true,
                    required: true,
                    validation: schemaDefaults.requiredString(),
                },
            ],
        },
    ],
}

gebiedsprogramma.validationSchema = generateDynamicSchema(
    gebiedsprogramma.dynamicSections
)

export default gebiedsprogramma
