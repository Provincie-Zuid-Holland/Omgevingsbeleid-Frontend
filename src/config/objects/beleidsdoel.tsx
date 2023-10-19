import { Hyperlink } from '@pzh-ui/components'
import { BullseyeArrow } from '@pzh-ui/icons'

import {
    useBeleidsdoelStaticLineageIdPost,
    useBeleidsdoelenLatestLineageIdGet,
    useBeleidsdoelenRelationsLineageIdGet,
    useBeleidsdoelenRelationsLineageIdPut,
    useBeleidsdoelenValidGet,
    useBeleidsdoelenValidLineageIdGet,
    useBeleidsdoelenVersionObjectUuidGet,
    useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
    useModulesObjectBeleidsdoelActiveLineageIdGet,
    useRevisionsModuleIdBeleidsdoelVersionObjectUuidGet,
} from '@/api/fetchers'
import {
    BeleidsdoelPatch,
    BeleidsdoelStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useBeleidsdoelenValidGet,
    useGetValidLineage: useBeleidsdoelenValidLineageIdGet,
    useGetVersion: useBeleidsdoelenVersionObjectUuidGet,
    useGetLatestLineage: useBeleidsdoelenLatestLineageIdGet,
    useGetRevision: useRevisionsModuleIdBeleidsdoelVersionObjectUuidGet,
    useGetRelations: useBeleidsdoelenRelationsLineageIdGet,
    usePutRelations: useBeleidsdoelenRelationsLineageIdPut,
    useGetLatestLineageInModule:
        useModulesModuleIdObjectBeleidsdoelLatestLineageIdGet,
    usePatchObjectInModule: useModulesModuleIdObjectBeleidsdoelLineageIdPatch,
    usePatchObject: null,
    useDeleteObject: null,
    usePostStatic: useBeleidsdoelStaticLineageIdPost,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: null,
    useGetActiveModules: useModulesObjectBeleidsdoelActiveLineageIdGet,
}

const beleidsdoel: DynamicObject<
    typeof fetchers,
    keyof BeleidsdoelPatch,
    (keyof BeleidsdoelStaticPostStatics)[]
> = {
    defaults: {
        singular: 'beleidsdoel',
        singularReadable: 'beleidsdoel',
        singularCapitalize: 'Beleidsdoel',
        plural: 'beleidsdoelen',
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
    connectionsDescription: (
        <>
            Binnen het omgevingsbeleid bestaan koppelingen en relaties. Een
            beleidsdoel komt voort uit een ambitie, en wordt uitgewerkt in één
            of meerdere beleidskeuzes. Hieronder een overzicht van de ambitie(s)
            en beleidskeuze(s). Bekijk voor het volledige overzicht het{' '}
            <Hyperlink text="beleidsnetwerk" to="/beleidsnetwerk" />.
        </>
    ),
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'In deze sectie kun je alle tekst met betrekking tot het beleidsdoel kwijt. Een goede omschrijving is kort, krachtig en actief opgeschreven.',
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
                        'Geef een korte omschrijving van dit beleidsdoel.',
                    type: 'textarea',
                    required: true,
                },
            ],
        },
    ],
}

beleidsdoel.validationSchema = generateDynamicSchema(
    beleidsdoel.dynamicSections
)

export default beleidsdoel
