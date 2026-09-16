import { useEffect } from 'react'

import { CircleExclamation } from '@pzh-ui/icons'

import { keepPreviousData } from '@tanstack/react-query'

import {
    getHoofdlijnGetHoofdlijnenListQueryKey,
    useHoofdlijnDeleteHoofdlijnen,
    useHoofdlijnGetHoofdlijnenDetail,
    useHoofdlijnGetHoofdlijnenList,
    useHoofdlijnPostHoofdlijnenCreate,
    useHoofdlijnPostHoofdlijnenEdit,
    useHoofdlijnPostHoofdlijnenSearch,
} from '@/api/fetchers'
import {
    CreateHoofdlijn,
    EditHoofdlijn,
    Hoofdlijn,
} from '@/api/fetchers.schemas'
import { generateDynamicSchema } from '@/validation/dynamicObject'

import { AnnotationApi, DynamicAnnotation } from './types'

const fetchers = {
    useDeleteAnnotations: useHoofdlijnDeleteHoofdlijnen,
}

const api = {
    overviewQueryKey: getHoofdlijnGetHoofdlijnenListQueryKey(),
    useOverview: ({
        limit,
        offset,
        query,
        refreshKey,
        sortColumn,
        sortOrder,
    }) => {
        const list = useHoofdlijnGetHoofdlijnenList(
            {
                limit,
                offset,
                sort_column: sortColumn,
                sort_order: sortOrder,
            },
            {
                query: {
                    placeholderData: keepPreviousData,
                    enabled: !query,
                },
            }
        )
        const {
            data: searchData,
            isPending: isSearchPending,
            mutate: search,
        } = useHoofdlijnPostHoofdlijnenSearch()

        useEffect(() => {
            if (!query) return

            search({
                params: {
                    query,
                    limit,
                    offset,
                    sort_column: sortColumn,
                    sort_order: sortOrder,
                },
            })
        }, [limit, offset, query, refreshKey, search, sortColumn, sortOrder])

        return query
            ? { data: searchData, isFetching: isSearchPending }
            : { data: list.data, isFetching: list.isFetching }
    },
    useDetail: (id, enabled) => {
        const { data, isFetching, queryKey } = useHoofdlijnGetHoofdlijnenDetail(
            id,
            {
                query: { enabled },
            }
        )

        return { data, isFetching, queryKey }
    },
    useCreate: () => {
        const { mutateAsync } = useHoofdlijnPostHoofdlijnenCreate()

        return {
            save: (values: CreateHoofdlijn) => mutateAsync({ data: values }),
        }
    },
    useEdit: () => {
        const { mutateAsync } = useHoofdlijnPostHoofdlijnenEdit()

        return {
            save: (id: string, values: EditHoofdlijn) =>
                mutateAsync({ hoofdlijnUuid: id, data: values }),
        }
    },
} satisfies AnnotationApi<CreateHoofdlijn, EditHoofdlijn, Hoofdlijn>

const hoofdlijn: DynamicAnnotation<typeof fetchers, typeof api> = {
    defaults: {
        singular: 'hoofdlijn',
        singularReadable: 'hoofdlijn',
        singularCapitalize: 'Hoofdlijn',
        plural: 'hoofdlijnen',
        pluralReadable: 'hoofdlijnen',
        pluralCapitalize: 'Hoofdlijnen',
        prefixSingular: 'de',
        prefixPlural: 'de',
        prefixNewObject: 'Nieuwe',
        demonstrative: 'deze',
        demonstrativeSingular: 'hoofdlijn',
        icon: CircleExclamation,
    },
    fetchers,
    api,
    overview: {
        columns: [
            {
                header: 'Naam',
                accessorKey: 'Name',
            },
            {
                header: 'Soort',
                accessorKey: 'Type',
            },
        ],
        defaultSortColumn: 'Name',
        idKey: 'UUID',
    },
    dynamicSections: [
        {
            fields: [
                {
                    name: 'Type',
                    label: 'Soort',
                    description:
                        'Geef in één woord of enkele woorden aan om wat voor soort hoofdlijn het gaat.',
                    placeholder: 'Bijvoorbeeld: Verplicht programma',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'Name',
                    label: 'Naam',
                    description: 'Geef de hoofdlijn een korte en bondige naam.',
                    placeholder: 'Bijvoorbeeld: Regionaal Waterprogramma',
                    type: 'text',
                    required: true,
                },
            ],
        },
    ],
}

hoofdlijn.validationSchema = generateDynamicSchema(hoofdlijn.dynamicSections)

export default hoofdlijn
