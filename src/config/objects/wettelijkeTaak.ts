import { BookBookmark } from '@pzh-ui/icons'

import {
    useWettelijkeTaakAtemporalCreateObject,
    useWettelijkeTaakAtemporalDeleteObject,
    useWettelijkeTaakAtemporalEditObject,
    useWettelijkeTaakGetRelationsList,
    useWettelijkeTaakListValidLineages,
    useWettelijkeTaakPostRelationsOverwrite,
    useWettelijkeTaakViewObjectLatest,
} from '@/api/fetchers'
import {
    WettelijkeTaakEdit,
    WettelijkeTaakStaticPostStatics,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'
import { schemaDefaults } from '@/validation/zodSchema'

import { DynamicObject } from './types'

const fetchers = {
    useGetValid: useWettelijkeTaakListValidLineages,
    useGetValidLineage: null,
    useGetVersion: null,
    useGetLatestLineage: useWettelijkeTaakViewObjectLatest,
    useGetRevision: null,
    useGetRelations: useWettelijkeTaakGetRelationsList,
    usePutRelations: useWettelijkeTaakPostRelationsOverwrite,
    useGetLatestLineageInModule: null,
    usePatchObjectInModule: null,
    usePatchObject: useWettelijkeTaakAtemporalEditObject,
    useDeleteObject: useWettelijkeTaakAtemporalDeleteObject,
    usePostStatic: null,
    useGetAcknowledgedRelations: null,
    usePostAcknowledgedRelations: null,
    usePatchAcknowledgedRelations: null,
    usePostObject: useWettelijkeTaakAtemporalCreateObject,
    useGetActiveModules: null,
}

const wettelijkeTaak: DynamicObject<
    typeof fetchers,
    keyof WettelijkeTaakEdit,
    (keyof WettelijkeTaakStaticPostStatics)[]
> = {
    defaults: {
        singular: 'wettelijke_taak',
        singularReadable: 'wettelijke taak',
        singularCapitalize: 'Wettelijke taak',
        plural: 'wettelijke-taken',
        pluralCapitalize: 'Wettelijke taken',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        atemporal: true,
        icon: BookBookmark,
    },
    fetchers,
    dynamicSections: [
        {
            title: 'Algemene informatie',
            description:
                'Formuleer in enkele woorden de titel van de wettelijke taak.',
            fields: [
                {
                    name: 'Title',
                    label: 'Titel',
                    type: 'text',
                    required: true,
                    validation: schemaDefaults.title,
                },
                {
                    name: 'Weblink',
                    label: 'Link naar wetten.nl',
                    type: 'url',
                    // @ts-ignore
                    validation: schemaDefaults.optionalUrl,
                },
            ],
        },
    ],
}

wettelijkeTaak.validationSchema = generateDynamicSchema(
    wettelijkeTaak.dynamicSections
)

export default wettelijkeTaak
