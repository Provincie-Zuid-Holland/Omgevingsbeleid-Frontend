import { Hyperlink } from '@pzh-ui/components'
import { FileLines } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    useBeleidsregelEditObjectStatic,
    useBeleidsregelGetListActiveModuleObjects,
    useBeleidsregelGetRelationsList,
    useBeleidsregelListValidLineageTree,
    useBeleidsregelListValidLineages,
    useBeleidsregelPostModulePatchObject,
    useBeleidsregelPostRelationsOverwrite,
    useBeleidsregelViewModuleObjectLatest,
    useBeleidsregelViewObjectLatest,
    useBeleidsregelViewObjectVersion,
    useGetRevisionsBeleidsregelVersion,
} from '@/api/fetchers'
import {
    BeleidsregelPatch,
    BeleidsregelStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidsregelListValidLineages,
    useGetValidLineage: useBeleidsregelListValidLineageTree,
    useGetVersion: useBeleidsregelViewObjectVersion,
    useGetLatestLineage: useBeleidsregelViewObjectLatest,
    useGetRevision: useGetRevisionsBeleidsregelVersion,
    useGetRelations: useBeleidsregelGetRelationsList,
    usePutRelations: useBeleidsregelPostRelationsOverwrite,
    useGetLatestLineageInModule: useBeleidsregelViewModuleObjectLatest,
    usePatchObjectInModule: useBeleidsregelPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useBeleidsregelEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useBeleidsregelGetListActiveModuleObjects,
}

const beleidsregel: DynamicObject<
    typeof fetchers,
    keyof BeleidsregelPatch,
    (keyof BeleidsregelStaticPostStatics)[]
> = {
    defaults: {
        singular: 'beleidsregel',
        singularReadable: 'beleidsregel',
        singularCapitalize: 'Beleidsregel',
        plural: 'beleidsregels',
        pluralReadable: 'beleidsregels',
        pluralCapitalize: 'Beleidsregels',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        slugOverview: 'omgevingsverordening',
        description:
            'De beleidsregels geven aan waar de provincie zich minimaal voor moet inspannen. De beleidsregels zijn individuele regels die de provincie zelf vaststelt.',
        icon: FileLines,
        parentType: 'Overig',
    },
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [{ type: 'beleidskeuze', key: 'Beleidskeuzes' }],
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            beleidsregel is veelal gekoppeld met beleidskeuzes. Hieronder een
            overzicht van de beleidskeuzes van deze beleidsregel. Bekijk voor
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
                'In deze sectie kun je alle tekst met betrekking tot de beleidsregel kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de beleidsregel.',
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
                    name: 'Weblink',
                    label: 'Link beleidsregels op wetten.nl',
                    type: 'url',
                    validation: schemaDefaults.url(),
                    required: true,
                },
            ],
        },
    ],
}

beleidsregel.validationSchema = generateDynamicSchema(
    beleidsregel.dynamicSections
)

export default beleidsregel
