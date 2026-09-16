import { KeyboardEvent, useCallback, useMemo, useState } from 'react'

import { Button, Heading, TabItem, Tabs, Text } from '@pzh-ui/components'
import { AngleRight } from '@pzh-ui/icons'

import { useUpdateEffect } from '@react-hookz/web'
import { keepPreviousData } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'

import { useModulesGetListModuleObjects } from '@/api/fetchers'
import { AnnotationFormModal } from '@/components/Modals/AnnotationModals'
import SearchBar from '@/components/SearchBar'
import { Annotation } from '@/config/annotations/types'
import {
    Model,
    ModelReturnTypeBasic,
    ModelReturnTypeBasicUnion,
} from '@/config/objects/types'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'

import AnnotationOverviewTable from './AnnotationOverviewTable'
import OverviewTable, { PAGE_LIMIT } from './OverviewTable'

type TabType = 'valid' | 'latest'

type OverviewQueryResult<TData> = {
    data?: TData
    isFetching?: boolean
}

type OverviewQueryHook<TData> = (
    params?: Record<string, unknown>,
    options?: {
        query?: Record<string, unknown>
    }
) => OverviewQueryResult<TData>

type OverviewData = {
    results: (ModelReturnTypeBasic | ModelReturnTypeBasicUnion)[]
    total?: number
}

type DynamicOverviewProps =
    | {
          entityType: 'object'
          model: Model
      }
    | {
          entityType: 'annotation'
          model: Annotation
      }

const DynamicOverview = (props: DynamicOverviewProps) => {
    const { canCreateModule } = usePermissions()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [activeTab, setActiveTab] = useState<TabType>('valid')
    const [query, setQuery] = useState('')
    const [annotationId, setAnnotationId] = useState<string | null>(null)
    const [annotationRevision, setAnnotationRevision] = useState(0)

    const { model } = props
    const annotation = props.entityType === 'annotation'
    const atemporal =
        props.entityType === 'object' && !!props.model.defaults.atemporal
    const { singularReadable, plural, pluralCapitalize, prefixNewObject } =
        model.defaults

    const handleChange = (e: KeyboardEvent) => {
        const value = (e.target as HTMLInputElement).value

        if (!value) {
            setQuery('')
        }
    }

    const handleSearch = ({ query }: { query: string }) => {
        setQuery(query)
    }

    useUpdateEffect(() => {
        setQuery('')
    }, [plural])

    useUpdateEffect(() => {
        if (activeTab === 'latest') setQuery('')
    }, [activeTab])

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: pluralCapitalize || '', isCurrent: true },
    ]
    const showCreateButton = canCreateModule && (annotation || atemporal)
    const openAnnotationModal = useCallback(
        (id: string | null) => {
            setAnnotationId(id)
            setActiveModal('annotationForm')
        },
        [setActiveModal]
    )

    return (
        <MutateLayout title={pluralCapitalize} breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-6 flex items-start justify-between gap-6">
                    <div>
                        <Heading size="xxl">{pluralCapitalize}</Heading>
                        {annotation && showCreateButton && (
                            <Button
                                variant="cta"
                                className="mt-6"
                                onPress={() => openAnnotationModal(null)}>
                                {prefixNewObject} {singularReadable}
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        {!annotation && showCreateButton && (
                            <Button asChild variant="cta">
                                <Link to={`/muteer/${plural}/nieuw`}>
                                    {prefixNewObject} {singularReadable}
                                </Link>
                            </Button>
                        )}
                        {(annotation || !atemporal) && (
                            <SearchBar
                                handleSubmit={handleSearch}
                                onKeyUp={handleChange}
                                className="w-auto min-w-92"
                                placeholder="Zoeken in lijst"
                            />
                        )}
                    </div>
                </div>

                {props.entityType === 'annotation' ? (
                    <>
                        <AnnotationOverviewTable
                            annotation={props.model}
                            query={query}
                            refreshKey={annotationRevision}
                            onEdit={openAnnotationModal}
                        />
                        <AnnotationFormModal
                            annotation={props.model}
                            annotationId={annotationId}
                            onSaved={() =>
                                setAnnotationRevision(value => value + 1)
                            }
                        />
                    </>
                ) : atemporal ? (
                    <TabTable
                        type="valid"
                        activeTab="valid"
                        model={props.model}
                    />
                ) : (
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={key => {
                            setActiveTab(key as typeof activeTab)
                            setQuery('')
                        }}>
                        <TabItem title="Vigerend" key="valid">
                            <TabTable
                                type="valid"
                                activeTab={activeTab}
                                model={props.model}
                                query={query}
                            />
                        </TabItem>
                        <TabItem title="In ontwerp" key="latest">
                            <TabTable
                                type="latest"
                                activeTab={activeTab}
                                model={props.model}
                                query={query}
                            />
                        </TabItem>
                    </Tabs>
                )}
            </div>
        </MutateLayout>
    )
}

interface TabTableProps {
    type: TabType
    activeTab: TabType
    model: Model
    query?: string
}

const TabTable = ({ type, activeTab, model, query }: TabTableProps) => {
    const navigate = useNavigate()
    const { canCreateModule } = usePermissions()

    const { atemporal, plural, pluralCapitalize, singular } = model.defaults
    const { useGetValid } = model.fetchers

    const [{ pageIndex }, setPagination] = useState({
        pageIndex: 1,
        pageSize: PAGE_LIMIT,
    })
    const [sortBy, setSortBy] = useState([
        {
            id: 'Title',
            desc: false,
        },
    ])

    const queryParams = {
        limit: PAGE_LIMIT,
        offset: (pageIndex - 1) * PAGE_LIMIT,
        sort_column: sortBy?.[0]?.id || 'Gebruikersnaam',
        sort_order: sortBy?.[0]?.desc ? 'DESC' : 'ASC',
        ...(type === 'latest' && {
            object_types: [singular],
            actions: ['Create', 'Edit'],
        }),
        ...(!!query && {
            [type === 'valid' ? 'filter_title' : 'title']: `%${query}%`,
        }),
    }

    const baseQueryOptions = {
        placeholderData: keepPreviousData,
        select: (data: OverviewData) => {
            if (type === 'valid') return data

            return {
                ...data,
                results: data.results.map(result =>
                    'Model' in result ? result.Model : result
                ),
            }
        },
    }

    const validQuery = (
        useGetValid as OverviewQueryHook<OverviewData> | null | undefined
    )?.(queryParams, {
        query: {
            ...baseQueryOptions,
            enabled: atemporal || activeTab === 'valid',
        },
    })

    const latestQuery = (
        useModulesGetListModuleObjects as OverviewQueryHook<OverviewData>
    )(queryParams, {
        query: {
            ...baseQueryOptions,
            enabled: activeTab === 'latest' && !atemporal,
        },
    })

    const { data, isFetching } =
        (type === 'valid' ? validQuery : latestQuery) ?? {}

    useUpdateEffect(() => {
        setPagination({
            pageIndex: 1,
            pageSize: PAGE_LIMIT,
        })
    }, [plural, query])

    /**
     * Setup Table columns
     */
    const columns = useMemo(
        () => [
            {
                header: 'Titel',
                accessorKey: 'Title',
            },
        ],
        []
    )

    /**
     * Format data before passing to Table
     */
    const formattedData = useMemo(
        () =>
            (
                data?.results as (
                    ModelReturnTypeBasic | ModelReturnTypeBasicUnion
                )[]
            )?.map(props => {
                const { Title, Object_ID } =
                    'Model' in props ? props.Model : props

                return {
                    Title: (
                        <span className="flex items-center justify-between">
                            <Text bold color="text-pzh-blue-500">
                                {Title}
                            </Text>
                            <AngleRight size={20} />
                        </span>
                    ),
                    ...((!atemporal || (atemporal && canCreateModule)) && {
                        onClick: () =>
                            navigate(
                                `/muteer/${plural}/${Object_ID}${
                                    atemporal ? '/bewerk' : ''
                                }`
                            ),
                    }),
                }
            }) || [],
        [data?.results, atemporal, plural, canCreateModule, navigate]
    )

    return (
        <OverviewTable
            columns={columns}
            rows={formattedData}
            total={data?.total}
            pageIndex={pageIndex}
            setPagination={setPagination}
            sortBy={sortBy}
            setSortBy={setSortBy}
            isFetching={isFetching}
            paginated={!query}
            emptyMessage={
                query
                    ? `Er zijn geen resultaten gevonden voor '${query}'`
                    : type === 'valid'
                      ? `Er zijn geen vigerende ${pluralCapitalize.toLowerCase()} gevonden`
                      : `Er zijn geen ${pluralCapitalize.toLowerCase()} in ontwerp`
            }
        />
    )
}

export default DynamicOverview
