import {
    useBeleidskeuzesLatestLineageIdGet,
    useBeleidskeuzesRelationsLineageIdGet,
    useBeleidskeuzesRelationsLineageIdPut,
    useBeleidskeuzeStaticLineageIdPost,
    useBeleidskeuzesValidGet,
    useBeleidskeuzesValidLineageIdGet,
    useBeleidskeuzesVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidskeuzeLatestLineageIdGet,
    useModulesModuleIdObjectBeleidskeuzeLineageIdPatch,
} from '@/api/fetchers'
import {
    BeleidskeuzePatch,
    BeleidskeuzeStaticPatch,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'

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
    usePostStatic: useBeleidskeuzeStaticLineageIdPost,
}

const beleidskeuze: DynamicObject<
    typeof fetchers,
    keyof BeleidskeuzePatch,
    (keyof BeleidskeuzeStaticPatch)[]
> = {
    defaults: {
        singular: 'beleidskeuze',
        singularCapitalize: 'Beleidskeuze',
        plural: 'beleidskeuzes',
        pluralCapitalize: 'Beleidskeuzes',
        prefixSingular: 'het',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        slugOverview: 'beleidskeuzes',
        description:
            'De beleidskeuzes geven aan hoe de provincie haar doelen wil bereiken. De beleidskeuzes zijn een uitwerking van de beleidsdoelen en komen voort uit de Omgevingsvisie.',
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
        { type: 'beleidskeuze', key: 'Beleidskeuzes' },
        { type: 'beleidsdoel', key: 'Beleidsdoelen' },
    ],
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
                },
            ],
        },
        {
            title: 'Beleidstekst',
            description:
                'In deze sectie kun je alle tekst met betrekking tot de beleidskeuze kwijt. Een goede beleidstekst is kort, krachtig en actief opgeschreven. Zo weet de lezer direct welke keuze de provincie maakt en waarom dit van belang is. Schrijf altijd ‘de provincie’, en niet ‘wij’.',
            fields: [
                {
                    name: 'Description_Choice',
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
                    name: 'Description_Operation',
                    label: 'Toelichting',
                    description:
                        'Op welke thema’s, onderwerpen en gebieden gaat de beleidskeuze iets wijzigen, en waarom is dit gewenst? Beschrijf ook de relatie met andere beleidsterreinen.',
                    type: 'wysiwyg',
                    required: true,
                },
            ],
        },
    ],
}

beleidskeuze.validationSchema = generateDynamicSchema(
    beleidskeuze.dynamicSections!
)

export default beleidskeuze
