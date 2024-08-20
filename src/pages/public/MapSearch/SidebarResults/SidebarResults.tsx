import { Transition } from '@headlessui/react'
import { Heading, Pagination, Text } from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import { useMemo, useRef } from 'react'

import {
    useSearchSourceGeoPost,
    useSearchSourceGeometryPost,
} from '@/api/fetchers'
import Filter from '@/components/Filter'
import { LoaderCard } from '@/components/Loader'
import SearchResultItem from '@/components/SearchResultItem'
import { ModelType } from '@/config/objects/types'
import useSearchParam from '@/hooks/useSearchParam'
import useFilterStore from '@/store/filterStore'
import useMapStore from '@/store/mapStore'

const PAGE_LIMIT = 20

const SidebarResults = () => {
    const { get, set, remove } = useSearchParam()
    const [paramWerkingsgebied, paramGeoQuery, page, filter, sidebarOpen] = get(
        ['werkingsgebied', 'geoQuery', 'page', 'filter', 'sidebarOpen']
    )

    const resultsContainer = useRef<HTMLDivElement>(null)

    const mapInstance = useMapStore(state => state.mapInstance)
    const isLoading = useMapStore(state => state.isDataLoading)
    const drawType = useMapStore(state => state.drawType)
    const pagination = useMapStore(state => state.pagination)
    const setPagination = useMapStore(state => state.setPagination)
    const currPage = useMapStore(() => parseInt(page || '1'))
    const setCurrPage = useMapStore(state => state.setCurrPage)

    const { amountOfFilters, filters, selectedFilters, setSelectedFilters } =
        useFilterStore(state => ({
            ...state,
            filters: state.filters
                .map(filter => {
                    const options = filter.options.filter(
                        option => !option.exclude?.includes('mapSearch')
                    )
                    return { ...filter, options }
                })
                .filter(filter => filter.options.length > 0),
            selectedFilters: {
                ...state.selectedFilters,
                mapSearch: filter?.split(',') || [],
            }.mapSearch.filter(Boolean),
            amountOfFilters: filter?.split(',')?.filter(Boolean)?.length || 0,
        }))

    const useSearch =
        drawType === 'werkingsgebied'
            ? useSearchSourceGeoPost
            : useSearchSourceGeometryPost

    const {
        data,
        mutate,
        reset,
        isPending: geoLoading,
    } = useSearch({
        mutation: {
            onSuccess(data) {
                if (!!!data.results.length) {
                    setPagination({
                        isLoaded: false,
                        total: data?.total,
                        limit: data?.limit,
                    })
                } else {
                    setPagination({
                        isLoaded: true,
                        total: data?.total,
                        limit: data?.limit,
                    })

                    if (resultsContainer.current) {
                        resultsContainer.current.scrollTo(0, 0)
                    }
                }
            },
        },
    })

    /**
     * Handle pagination
     */
    const handlePageChange = (page: number) => {
        setCurrPage(page)
        set('page', page.toString())
    }

    /**
     * Handle change of dropdown field
     */
    const handleDropdownChange = (
        val: { label: string; value: ModelType }[]
    ) => {
        setPagination({ ...pagination, isLoaded: false })
        setCurrPage(1)
        remove('page')

        const selected = (val as { label: string; value: ModelType }[])?.map(
            e => e.value
        )

        setSelectedFilters('mapSearch', selected)
        set('filter', selected)
    }

    /**
     * Set default value of object filter based on provided filters
     */
    const defaultValue = useMemo(
        () =>
            filters.flatMap(filter =>
                filter.options.filter(option =>
                    selectedFilters?.includes(option.value)
                )
            ),
        [filters, selectedFilters]
    )

    /**
     * Get all possible filter options
     */
    const allFilterOptions = useMemo(
        () =>
            filters.flatMap(filter =>
                filter.options.map(option => option.value)
            ),
        [filters]
    )

    /**
     * If URL contains sidebarOpen=true open the results sidebar.
     */
    useUpdateEffect(() => {
        const geoQuery = paramGeoQuery?.split(',')

        if ((!geoQuery && !paramWerkingsgebied) || !drawType) return

        if (
            sidebarOpen === 'true' &&
            paramGeoQuery &&
            !paramWerkingsgebied &&
            !!geoQuery
        ) {
            let latLng

            if (drawType === 'marker') {
                const [x, y] = geoQuery[0].split('+')

                latLng = `${x} ${y}`
            } else {
                latLng = geoQuery
                    .flatMap(val => val.split('+').join(' '))
                    .join(',')
            }

            mutate({
                // @ts-ignore
                data: {
                    Geometry:
                        drawType === 'marker'
                            ? `POINT (${latLng})`
                            : `POLYGON ((${latLng}))`,
                    Object_Types: !!selectedFilters.length
                        ? selectedFilters
                        : allFilterOptions,
                },
                params: {
                    limit: PAGE_LIMIT,
                    offset: (currPage - 1) * PAGE_LIMIT,
                },
            })
        }

        if (sidebarOpen === 'true' && paramWerkingsgebied) {
            mutate({
                // @ts-ignore
                data: {
                    Area_List: [paramWerkingsgebied],
                    Object_Types: !!selectedFilters.length
                        ? selectedFilters
                        : allFilterOptions,
                },
                params: {
                    limit: PAGE_LIMIT,
                    offset: (currPage - 1) * PAGE_LIMIT,
                },
            })
        }

        if (sidebarOpen === 'true' && !paramWerkingsgebied && !paramGeoQuery) {
            reset()
            setPagination({
                isLoaded: false,
                total: data?.total,
                limit: data?.limit,
            })
        } else if (sidebarOpen !== 'true') {
            setCurrPage(1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        sidebarOpen,
        paramWerkingsgebied,
        paramGeoQuery,
        drawType,
        mapInstance,
        currPage,
        filter,
    ])

    return (
        <Transition
            show={sidebarOpen === 'true'}
            enter="transition-all ease-out duration-300 delay-100 transform"
            enterFrom="-mr-[840px]"
            enterTo="mr-0"
            leave="transition-all ease-in duration-300 transform"
            leaveFrom="mr-0"
            leaveTo="-mr-[840px]"
            className="relative z-1 w-full max-w-2xl overflow-hidden px-4 pb-4 pt-4 md:px-10 md:pb-0 md:shadow-pane lg:px-20">
            <div className="border-b border-pzh-gray-300 pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <Heading level="3" size="m">
                            Resultaten
                        </Heading>
                        {!isLoading && !geoLoading ? (
                            <span className="block text-s text-pzh-blue-900 text-opacity-50">
                                {!data?.total
                                    ? 'Er zijn geen resultaten'
                                    : data.total === 1
                                    ? `Er is 1 resultaat`
                                    : `Er zijn ${data.total} resultaten`}
                            </span>
                        ) : (
                            <LoaderCard
                                height="18"
                                width="130"
                                className="w-auto"
                            />
                        )}
                    </div>
                    <Filter
                        className="min-w-[250px]"
                        filters={filters}
                        activeFilters={amountOfFilters}
                        handleChange={handleDropdownChange}
                        defaultValue={defaultValue}
                    />
                </div>
            </div>
            <div className="mt-2 h-full">
                <div
                    ref={resultsContainer}
                    className="h-full pb-8 pt-4 md:overflow-auto md:pb-24">
                    {!isLoading && !geoLoading ? (
                        <>
                            {!!data?.results.length ? (
                                <ul className="mb-4">
                                    {data.results.map(item => (
                                        <SearchResultItem
                                            query={undefined}
                                            key={item.UUID}
                                            Description={
                                                item.Omschrijving || ''
                                            }
                                            Object_Type={item.Type}
                                            Title={item.Titel || ''}
                                            {...item}
                                        />
                                    ))}
                                </ul>
                            ) : (
                                <Text className="mt-2">
                                    Er zijn geen resultaten voor{' '}
                                    {drawType === 'polygon'
                                        ? 'het getekende gebied'
                                        : drawType === 'marker'
                                        ? 'het ingevoerde adres'
                                        : drawType === 'werkingsgebied'
                                        ? 'dit werkingsgebied'
                                        : 'de geplaatste marker'}
                                    . Probeer het opnieuw (binnen de grenzen van
                                    de provincie Zuid-Holland).
                                </Text>
                            )}
                        </>
                    ) : (
                        <div className="mt-4">
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                            <LoaderCard height="150" />
                        </div>
                    )}

                    {!!pagination.total &&
                        !!pagination.limit &&
                        pagination.total > pagination.limit && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    onPageChange={handlePageChange}
                                    current={currPage}
                                    total={pagination.total}
                                    limit={pagination.limit}
                                />
                            </div>
                        )}
                </div>
            </div>
        </Transition>
    )
}

export default SidebarResults
