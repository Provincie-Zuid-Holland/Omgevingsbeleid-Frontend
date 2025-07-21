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
import {
    BeleidskeuzePatch,
    BeleidskeuzeStaticPostStatics,
} from '@/api/fetchers.schemas'
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

const beleidskeuze: DynamicObject<
    typeof fetchers,
    keyof BeleidskeuzePatch,
    (keyof BeleidskeuzeStaticPostStatics)[],
    typeof queryKeys
> = {
    defaults: {
        singular: 'beleidskeuze',
        singularReadable: 'beleidskeuze',
        singularCapitalize: 'Beleidskeuze',
        plural: 'beleidskeuzes',
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
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            relatie wordt aangegaan tussen beleidskeuzes inclusief een
            duidelijke motivering en een koppeling kan met alle niveaus binnen
            het omgevingsbeleid. Bekijk voor het volledige overzicht het{' '}
            <Hyperlink asChild>
                <Link to="/beleidsnetwerk">beleidsnetwerk</Link>
            </Hyperlink>
            .
        </>
    ),
    acknowledgedRelation: 'beleidskeuze',
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description: 'De algemene informatie bevat een duidelijke titel.',
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
            ],
        },
        {
            title: 'Beleidstekst',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de beleidskeuze kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct welke keuze de provincie maakt en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
            fields: [
                {
                    name: 'Description',
                    label: 'Wat wil de provincie bereiken?',
                    description:
                        'Hier geef je aan welke keuze de provincie heeft genomen. Formuleer in één of enkele zinnen wat de provincie wil bereiken en welke rechtsgevolgen dit eventueel heeft voor derden.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                },
                {
                    name: 'Cause',
                    label: 'Aanleiding',
                    description:
                        'De aanleiding geeft de lezer informatie over welke ontwikkelingen gaande zijn in de maatschappij en waarom de provincie hier op inspeelt. Beschrijf hier welk probleem, dreiging of kans ten grondslag ligt aan de beleidskeuze.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                },
                {
                    name: 'Provincial_Interest',
                    label: 'Provinciaal belang',
                    description:
                        'Beschrijf waarom de provincie deze keuze maakt en waarom dit niet (enkel) kan worden overgelaten aan andere overheden. Vanuit juridisch perspectief is het belangrijk om het provinciaal belang te definiëren. Zie ook artikel 2.3 van de Omgevingswet.',
                    type: 'wysiwyg',
                    required: true,
                    hasAreaSelect: true,
                },
                {
                    name: 'Explanation',
                    label: 'Nadere uitwerking',
                    description:
                        'Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen.',
                    type: 'wysiwyg',
                    hasAreaSelect: true,
                },
            ],
        },
        {
            title: 'Werkingsgebied',
            description:
                'Het werkingsgebied geeft het gebied weer waar de beleidskeuze betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld, toegestaan of juist verboden.',
            fields: [
                {
                    name: 'Ambtsgebied',
                    label: 'Selecteer het gebied',
                    description: (
                        <>
                            Is op deze beleidskeuze het ambtsgebied van
                            toepassing of een specifiek werkingsgebied? Heeft
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
                    name: 'Werkingsgebied_Code',
                    label: 'Werkingsgebied',
                    type: 'search',
                    status: 'all',
                    placeholder: 'Selecteer een werkingsgebied',
                    filterType: ['werkingsgebied'],
                    objectKey: 'Werkingsgebied_Code',
                    components: {
                        DropdownIndicator: () => (
                            <div className="mr-4">
                                <AngleDown className="text-pzh-blue-900" />
                            </div>
                        ),
                    },
                    conditionalField: 'Ambtsgebied',
                },
            ],
        },
        {
            title: 'Primaire koppeling',
            fields: [
                {
                    name: 'Hierarchy_Code',
                    label: 'Beleidsdoel',
                    type: 'search',
                    required: true,
                    objectKey: 'Hierarchy_Code',
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
