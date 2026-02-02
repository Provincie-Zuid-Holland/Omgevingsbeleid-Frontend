import { Hyperlink } from '@pzh-ui/components'
import { ArrowTrendUp } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    useAmbitieEditObjectStatic,
    useAmbitieGetListActiveModuleObjects,
    useAmbitieGetRelationsList,
    useAmbitieListValidLineageTree,
    useAmbitieListValidLineages,
    useAmbitiePostModulePatchObject,
    useAmbitiePostRelationsOverwrite,
    useAmbitieViewModuleObjectLatest,
    useAmbitieViewObjectLatest,
    useAmbitieViewObjectVersion,
    useGetRevisionsAmbitieVersion,
} from '@/api/fetchers'
import { AmbitiePatch, AmbitieStaticPostStatics } from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useAmbitieListValidLineages,
    useGetValidLineage: useAmbitieListValidLineageTree,
    useGetVersion: useAmbitieViewObjectVersion,
    useGetLatestLineage: useAmbitieViewObjectLatest,
    useGetRevision: useGetRevisionsAmbitieVersion,
    useGetRelations: useAmbitieGetRelationsList,
    usePutRelations: useAmbitiePostRelationsOverwrite,
    useGetLatestLineageInModule: useAmbitieViewModuleObjectLatest,
    usePatchObjectInModule: useAmbitiePostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useAmbitieEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useAmbitieGetListActiveModuleObjects,
}

const ambitie: DynamicObject<
    typeof fetchers,
    keyof AmbitiePatch,
    (keyof AmbitieStaticPostStatics)[]
> = {
    defaults: {
        singular: 'ambitie',
        singularReadable: 'ambitie',
        singularCapitalize: 'Ambitie',
        plural: 'ambities',
        pluralReadable: 'ambities',
        pluralCapitalize: 'Ambities',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        slugOverview: 'omgevingsvisie',
        description:
            'De ambities geven aan waar de provincie naar wil streven. De ambities komen voort uit het coalitieakkoord en worden vastgesteld in de Omgevingsvisie.',
        icon: ArrowTrendUp,
        parentType: 'Visie',
        slugOverviewPublic: true,
    },
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [{ type: 'beleidsdoel', key: 'Beleidsdoelen' }],
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            ambitie is veelal gekoppeld met beleidsdoelen. Hieronder een
            overzicht van de beleidsdoelen van deze ambitie. Bekijk voor het
            volledige overzicht het{' '}
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
                'In deze sectie kun je alle tekst met betrekking tot de ambitie kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
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
                    hasAreaSelect: true,
                },
            ],
        },
    ],
}

ambitie.validationSchema = generateDynamicSchema(ambitie.dynamicSections)

export default ambitie
