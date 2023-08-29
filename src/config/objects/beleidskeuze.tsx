import { Hyperlink } from '@pzh-ui/components'
import { Split } from '@pzh-ui/icons'

import {
    getBeleidskeuzeAcknowledgedRelationsLineageIdGetQueryKey,
    useBeleidskeuzeAcknowledgedRelationsLineageIdEditPost,
    useBeleidskeuzeAcknowledgedRelationsLineageIdGet,
    useBeleidskeuzeAcknowledgedRelationsLineageIdPost,
    useBeleidskeuzesLatestLineageIdGet,
    useBeleidskeuzesRelationsLineageIdGet,
    useBeleidskeuzesRelationsLineageIdPut,
    useBeleidskeuzeStaticLineageIdPost,
    useBeleidskeuzesValidGet,
    useBeleidskeuzesValidLineageIdGet,
    useBeleidskeuzesVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
    useModulesObjectsBeleidskeuzeActiveLineageIdGet,
} from '@/api/fetchers'
import {
    BeleidskeuzePatch,
    BeleidskeuzeStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidskeuzesValidGet,
    useGetValidLineage: useBeleidskeuzesValidLineageIdGet,
    useGetVersion: useBeleidskeuzesVersionObjectUuidGet,
    useGetLatestLineage: useBeleidskeuzesLatestLineageIdGet,
    useGetRelations: useBeleidskeuzesRelationsLineageIdGet,
    usePutRelations: useBeleidskeuzesRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useBeleidskeuzeStaticLineageIdPost,
    useGetAcknowledgedRelations:
        useBeleidskeuzeAcknowledgedRelationsLineageIdGet,
    usePostAcknowledgedRelations:
        useBeleidskeuzeAcknowledgedRelationsLineageIdPost,
    usePatchAcknowledgedRelations:
        useBeleidskeuzeAcknowledgedRelationsLineageIdEditPost,
    usePostObject: null,
    useGetActiveModules: useModulesObjectsBeleidskeuzeActiveLineageIdGet,
}

const queryKeys = {
    getAcknowledgedRelations:
        getBeleidskeuzeAcknowledgedRelationsLineageIdGetQueryKey,
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
        slugOverview: 'omgevingsvisie/beleidskeuzes',
        description:
            'De beleidskeuzes geven aan hoe de provincie haar doelen wil bereiken. De beleidskeuzes zijn een uitwerking van de beleidsdoelen en komen voort uit de Omgevingsvisie.',
        icon: Split,
        parentType: 'Visie',
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
            <Hyperlink text="beleidsnetwerk" to="/beleidsnetwerk" />.
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
                },
                {
                    name: 'Cause',
                    label: 'Aanleiding',
                    description:
                        'De aanleiding geeft de lezer informatie over welke ontwikkelingen gaande zijn in de maatschappij en waarom de provincie hier op inspeelt. Beschrijf hier welk probleem, dreiging of kans ten grondslag ligt aan de beleidskeuze.',
                    type: 'wysiwyg',
                    required: true,
                },
                {
                    name: 'Provincial_Interest',
                    label: 'Provinciaal belang',
                    description:
                        'Beschrijf waarom de provincie deze keuze maakt en waarom dit niet (enkel) kan worden overgelaten aan andere overheden. Vanuit juridisch perspectief is het belangrijk om het provinciaal belang te definiëren. Zie ook artikel 2.3 van de Omgevingswet.',
                    type: 'wysiwyg',
                    required: true,
                },
                {
                    name: 'Explanation',
                    label: 'Toelichting',
                    description:
                        'Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen.',
                    type: 'wysiwyg',
                    required: true,
                },
            ],
        },
        {
            title: 'Werkingsgebied',
            description:
                'Het werkingsgebied geeft het gebied weer waar de beleidskeuze betrekking op heeft. Binnen dit gebied worden bepaalde activiteiten gestimuleerd, ontwikkeld, toegestaan of juist verboden.',
            fields: [
                {
                    name: 'Gebied_UUID',
                    label: 'Selecteer werkingsgebied',
                    description: (
                        <>
                            Selecteer het werkingsgebied wat bij deze
                            beleidskeuze van toepassing is. Heeft jouw
                            beleidskeuze nog geen geschikt werkingsgebied, of
                            moet het huidige gebied aangepast worden? Neem dan
                            contact op via{' '}
                            <a
                                href="mailto:omgevingsbeleid@pzh.nl"
                                className="underline">
                                omgevingsbeleid@pzh.nl
                            </a>
                            .
                        </>
                    ),
                    type: 'area',
                },
            ],
        },
    ],
}

beleidskeuze.validationSchema = generateDynamicSchema(
    beleidskeuze.dynamicSections
)

export default beleidskeuze
