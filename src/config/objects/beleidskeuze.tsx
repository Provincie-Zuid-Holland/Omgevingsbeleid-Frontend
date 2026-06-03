import { Hyperlink } from '@pzh-ui/components'
import { AngleDown, Split } from '@pzh-ui/icons'
import { Link } from 'react-router-dom'

import {
    getBeleidskeuzeGetAcknowledgedRelationListQueryKey,
    useBeleidskeuzeEditObjectStatic,
    useBeleidskeuzeGetAcknowledgedRelationList,
    useBeleidskeuzeGetAcknowledgedRelationRequest,
    useBeleidskeuzeGetListActiveModuleObjects,
    useBeleidskeuzeGetRelationsList,
    useBeleidskeuzeListValidLineageTree,
    useBeleidskeuzeListValidLineages,
    useBeleidskeuzePostAcknowledgedRelationEdit,
    useBeleidskeuzePostModulePatchObject,
    useBeleidskeuzePostRelationsOverwrite,
    useBeleidskeuzeViewModuleObjectLatest,
    useBeleidskeuzeViewObjectLatest,
    useBeleidskeuzeViewObjectVersion,
    useGetRevisionsBeleidskeuzeVersion,
} from '@/api/fetchers'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidskeuzeListValidLineages,
    useGetValidLineage: useBeleidskeuzeListValidLineageTree,
    useGetVersion: useBeleidskeuzeViewObjectVersion,
    useGetLatestLineage: useBeleidskeuzeViewObjectLatest,
    useGetRevision: useGetRevisionsBeleidskeuzeVersion,
    useGetRelations: useBeleidskeuzeGetRelationsList,
    usePutRelations: useBeleidskeuzePostRelationsOverwrite,
    useGetLatestLineageInModule: useBeleidskeuzeViewModuleObjectLatest,
    usePatchObjectInModule: useBeleidskeuzePostModulePatchObject,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useBeleidskeuzeEditObjectStatic,
    useGetAcknowledgedRelations: useBeleidskeuzeGetAcknowledgedRelationList,
    usePostAcknowledgedRelations: useBeleidskeuzeGetAcknowledgedRelationRequest,
    usePatchAcknowledgedRelations: useBeleidskeuzePostAcknowledgedRelationEdit,
    usePostObject: null,
    useGetActiveModules: useBeleidskeuzeGetListActiveModuleObjects,
}

const queryKeys = {
    getAcknowledgedRelations:
        getBeleidskeuzeGetAcknowledgedRelationListQueryKey,
}

const beleidskeuze: DynamicObject<typeof fetchers, typeof queryKeys> = {
    defaults: {
        singular: 'beleidskeuze',
        singularReadable: 'beleidskeuze',
        singularCapitalize: 'Beleidskeuze',
        plural: 'beleidskeuzes',
        pluralReadable: 'beleidskeuzes',
        pluralCapitalize: 'Beleidskeuzes',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        slugOverview: 'omgevingsvisie',
        description:
            'De beleidskeuzes geven aan hoe de provincie haar doelen wil bereiken. De beleidskeuzes zijn een uitwerking van de beleidsdoelen en komen voort uit de Omgevingsvisie.',
        icon: Split,
        parentType: 'Visie',
        slugOverviewPublic: true,
    },
    fetchers,
    queryKeys,
    staticData: [
        'Client_1_UUID',
        'Owner_1_UUID',
        'Owner_2_UUID',
        'Portfolio_Holder_1_UUID',
        'Portfolio_Holder_2_UUID',
    ],
    allowedConnections: [
        { type: 'wettelijke_taak', key: 'WettelijkeTaken' },
        { type: 'nationaal_belang', key: 'NationaleBelangen' },
        { type: 'beleidsdoel', key: 'Beleidsdoelen' },
    ],
    connectionsDescription: object => (
        <>
            Deze beleidskeuze hoort bij het beleidsdoel '{object}'. De
            beleidskeuze is uitgewerkt in maatregelen. Een maatregel beschrijft
            wat de provincie doet om de beleidskeuze tot uitvoering brengen.
            Bekijk voor het volledige overzicht het{' '}
            <Hyperlink asChild>
                <Link to="/beleidsnetwerk">beleidsnetwerk</Link>
            </Hyperlink>
            .
        </>
    ),
    acknowledgedRelation: 'beleidskeuze',
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
                    label: 'Wat wil de provincie bereiken?',
                    description:
                        'Hier geef je aan welke keuze de provincie heeft genomen. Formuleer in één of enkele zinnen wat de provincie wil bereiken en welke rechtsgevolgen dit eventueel heeft voor derden.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
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
                {
                    name: 'Cause',
                    label: 'Aanleiding',
                    description:
                        'De aanleiding geeft de lezer informatie over welke ontwikkelingen gaande zijn in de maatschappij en waarom de provincie hier op inspeelt. Beschrijf hier welk probleem, dreiging of kans ten grondslag ligt aan de beleidskeuze.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
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
                {
                    name: 'Provincial_Interest',
                    label: 'Motivering provinciaal belang',
                    description:
                        'Beschrijf waarom de provincie deze keuze maakt en waarom dit niet (enkel) kan worden overgelaten aan andere overheden. Vanuit juridisch perspectief is het belangrijk om het provinciaal belang te definiëren. Zie ook artikel 2.3 van de Omgevingswet.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
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
                {
                    name: 'Explanation',
                    label: 'Nadere uitwerking',
                    description:
                        'Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen.',
                    type: 'wysiwyg',
                    hasAreaSelect: true,
                    customMenuOptions: ['heading', 'image'],
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
                {
                    name: 'Ambtsgebied',
                    label: 'Selecteer de gebiedengroep',
                    description: (
                        <>
                            Is op deze beleidskeuze het ambtsgebied van
                            toepassing of een specifieke gebiedengroep? Heeft
                            jouw beleidskeuze nog geen geschikt gebied, of moet
                            het huidige gebied aangepast worden? Neem dan
                            contact op via{' '}
                            <a
                                href="mailto:omgevingsbeleid@pzh.nl"
                                className="underline">
                                omgevingsbeleid@pzh.nl
                            </a>
                            .
                        </>
                    ),
                    type: 'checkbox',
                    options: [
                        {
                            label: 'Op deze beleidskeuze is het ambtsgebied van toepassing',
                            value: 'true',
                        },
                    ],
                },
                {
                    name: 'Gebiedengroep_Code',
                    label: 'Gebiedengroep',
                    type: 'search',
                    status: 'all',
                    placeholder: 'Selecteer een gebiedengroep',
                    filterType: ['gebiedengroep'],
                    objectKey: 'Object_Code',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    conditionalField: 'Ambtsgebied',
                },
                {
                    name: 'Hierarchy_Code',
                    label: 'Beleidsdoel',
                    type: 'search',
                    required: true,
                    objectKey: 'Object_Code',
                    filterType: ['beleidsdoel'],
                    status: 'all',
                    placeholder: 'Kies het beleidsdoel',
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

beleidskeuze.validationSchema = generateDynamicSchema(
    beleidskeuze.dynamicSections
)

export default beleidskeuze
