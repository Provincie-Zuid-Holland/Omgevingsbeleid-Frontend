import { Hyperlink } from '@pzh-ui/components'
import { LocationDot } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    useGebiedsprogrammasLatestLineageIdGet,
    useGebiedsprogrammasRelationsLineageIdGet,
    useGebiedsprogrammasRelationsLineageIdPut,
    useGebiedsprogrammasStaticLineageIdPost,
    useGebiedsprogrammasValidGet,
    useGebiedsprogrammasValidLineageIdGet,
    useGebiedsprogrammasVersionObjectUuidGet,
    useModulesModuleIdObjectGebiedsprogrammasLatestLineageIdGet,
    useModulesModuleIdObjectGebiedsprogrammasLineageIdPatch,
    useModulesObjectsGebiedsprogrammaActiveLineageIdGet,
    useRevisionsModuleIdGebiedsprogrammaVersionObjectUuidGet,
} from '@/api/fetchers'
import {
    GebiedsprogrammaPatch,
    GebiedsprogrammaStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useGebiedsprogrammasValidGet,
    useGetValidLineage: useGebiedsprogrammasValidLineageIdGet,
    useGetVersion: useGebiedsprogrammasVersionObjectUuidGet,
    useGetLatestLineage: useGebiedsprogrammasLatestLineageIdGet,
    useGetRevision: useRevisionsModuleIdGebiedsprogrammaVersionObjectUuidGet,
    useGetRelations: useGebiedsprogrammasRelationsLineageIdGet,
    usePutRelations: useGebiedsprogrammasRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectGebiedsprogrammasLatestLineageIdGet,
    usePatchObjectInModule:
        useModulesModuleIdObjectGebiedsprogrammasLineageIdPatch,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useGebiedsprogrammasStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useModulesObjectsGebiedsprogrammaActiveLineageIdGet,
}

const gebiedsprogramma: DynamicObject<
    typeof fetchers,
    keyof GebiedsprogrammaPatch,
    (keyof GebiedsprogrammaStaticPostStatics)[]
> = {
    defaults: {
        singular: 'gebiedsprogramma',
        singularReadable: 'gebiedsprogramma',
        singularCapitalize: 'Gebiedsprogramma',
        plural: 'gebiedsprogrammas',
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
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [{ type: 'maatregel', key: 'Maatregelen' }],
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
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot het gebiedsprogramma kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de ambitie.',
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
                    required: true,
                },
                {
                    name: 'Image',
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
