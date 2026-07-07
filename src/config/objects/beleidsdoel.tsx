import { Hyperlink } from '@pzh-ui/components'
import { AngleDown, BullseyeArrow } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    useBeleidsdoelEditObjectStatic,
    useBeleidsdoelGetListActiveModuleObjects,
    useBeleidsdoelGetRelationsList,
    useBeleidsdoelListValidLineageTree,
    useBeleidsdoelListValidLineages,
    useBeleidsdoelPostModulePatchObject,
    useBeleidsdoelPostRelationsOverwrite,
    useBeleidsdoelViewGetObjectStatic,
    useBeleidsdoelViewModuleObjectLatest,
    useBeleidsdoelViewObjectLatest,
    useBeleidsdoelViewObjectVersion,
    useGetRevisionsBeleidsdoelVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidsdoelListValidLineages,
    useGetValidLineage: useBeleidsdoelListValidLineageTree,
    useGetVersion: useBeleidsdoelViewObjectVersion,
    useGetLatestLineage: useBeleidsdoelViewObjectLatest,
    useGetRevision: useGetRevisionsBeleidsdoelVersion,
    useGetRelations: useBeleidsdoelGetRelationsList,
    usePutRelations: useBeleidsdoelPostRelationsOverwrite,
    useGetLatestLineageInModule: useBeleidsdoelViewModuleObjectLatest,
    usePatchObjectInModule: useBeleidsdoelPostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    useGetStatic: useBeleidsdoelViewGetObjectStatic,
    usePostStatic: useBeleidsdoelEditObjectStatic,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useBeleidsdoelGetListActiveModuleObjects,
}

const beleidsdoel: DynamicObject<typeof fetchers> = {
    defaults: {
        singular: 'beleidsdoel',
        singularReadable: 'beleidsdoel',
        singularCapitalize: 'Beleidsdoel',
        plural: 'beleidsdoelen',
        pluralReadable: 'beleidsdoelen',
        pluralCapitalize: 'Beleidsdoelen',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuw',
        demonstrative: 'dit',
        slugOverview: 'omgevingsvisie',
        description:
            'De beleidsdoelen geven aan wat de provincie wil bereiken. De beleidsdoelen zijn een uitwerking van de ambities en komen voort uit de begroting.',
        icon: BullseyeArrow,
        parentType: 'Visie',
        slugOverviewPublic: true,
    },
    fetchers,
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [
        { type: 'ambitie', key: 'Ambities' },
        { type: 'beleidskeuze', key: 'Beleidskeuzes' },
    ],
    connectionsDescription: object => (
        <>
            Dit beleidsdoel hoort bij de ambitie '{object}'. Het beleidsdoel is
            verder uitgewerkt in beleidskeuzes die richting geven aan de
            uitvoering. Bekijk voor het volledige overzicht het{' '}
            <Hyperlink asChild>
                <Link to="/beleidsnetwerk">beleidsnetwerk</Link>
            </Hyperlink>
            .
        </>
    ),
    dynamicSections: [
        {
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    description:
                        'Formuleer in enkele woorden de titel van de beleidskeuze.',
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
                    hasAreaSelect: true,
                },
            ],
        },
        {
            fields: [
                {
                    name: 'Hierarchy_Code',
                    label: 'Koppel aan ambitie',
                    description:
                        'Geef aan uit welke ambitie dit beleidsdoel voortkomt.',
                    type: 'search',
                    required: true,
                    objectKey: 'Object_Code',
                    filterType: ['ambitie'],
                    status: 'all',
                    placeholder: 'Kies de ambitie',
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

beleidsdoel.validationSchema = generateDynamicSchema(
    beleidsdoel.dynamicSections
)

export default beleidsdoel
