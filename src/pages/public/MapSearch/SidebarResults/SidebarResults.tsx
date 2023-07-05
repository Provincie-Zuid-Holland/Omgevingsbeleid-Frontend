import { Transition } from '@headlessui/react'
import { Heading, Pagination, Text } from '@pzh-ui/components'
import { Map } from 'leaflet'
import { useMemo, useRef, useState } from 'react'
import { useUpdateEffect } from 'react-use'

import { useSearchGeoPost } from '@/api/fetchers'
import Filter from '@/components/Filter'
import { LoaderCard } from '@/components/Loader'
import SearchResultItem from '@/components/SearchResultItem'
import { ModelType } from '@/config/objects/types'
import useSearchParam from '@/hooks/useSearchParam'
import useFilterStore from '@/store/filterStore'

const PAGE_LIMIT = 20

interface SidebarResultsProps {
    searchOpen: boolean
    drawType?: string
    UUIDs: string[]
    mapInstance: Map | null
    geoLoading: boolean
}

const SidebarResults = ({
    searchOpen,
    drawType,
    UUIDs,
    mapInstance,
    geoLoading,
}: SidebarResultsProps) => {
    const { get, set, remove } = useSearchParam()
    const [paramSearchOpen, paramWerkingsgebied, page, filter] = get([
        'searchOpen',
        'werkingsgebied',
        'page',
        'filter',
    ])

    const resultsContainer = useRef<HTMLDivElement>(null)

    const { amountOfFilters, filters, selectedFilters, setSelectedFilters } =
        useFilterStore(state => ({
            ...state,
            filters: state.filters
                .map(filter => {
                    const options = filter.options.filter(
                        option => option.exclude !== 'mapSearch'
                    )
                    return { ...filter, options }
                })
                .filter(filter => filter.options.length > 0),
            selectedFilters: {
                ...state.selectedFilters,
                mapSearch: filter?.split(',') || [],
            },
            amountOfFilters: filter?.split(',')?.length || 0,
        }))

    const { data, mutate, isLoading } = useSearchGeoPost({
        mutation: {
            onSuccess(data) {
                if (!!!data.results.length) {
                    setPagination({
                        isLoaded: false,
                        total: data?.total,
                        limit: data?.limit,
                    })
                } else {
                    if (!pagination.isLoaded) {
                        setPagination({
                            isLoaded: true,
                            total: data?.total,
                            limit: data?.limit,
                        })
                    }

                    if (resultsContainer.current) {
                        resultsContainer.current.scrollTo(0, 0)
                    }
                }
            },
        },
    })

    const [currPage, setCurrPage] = useState(parseInt(page || '1'))
    const [pagination, setPagination] = useState({
        isLoaded: false,
        total: data?.total,
        limit: data?.limit,
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

        const selected =
            val.length === 0
                ? filters.flatMap(filter =>
                      filter.options.map(option => option.value)
                  )
                : (val as { label: string; value: ModelType }[])?.map(
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
                    selectedFilters?.mapSearch.includes(option.value)
                )
            ),
        [filters, selectedFilters]
    )

    /**
     * If URL contains searchOpen=true open the results sidebar.
     */
    useUpdateEffect(() => {
        if (
            paramSearchOpen === 'true' &&
            UUIDs.length &&
            !paramWerkingsgebied
        ) {
            mutate({
                data: {
                    Area_List: UUIDs,
                    Object_Types: selectedFilters.mapSearch,
                },
                params: {
                    limit: PAGE_LIMIT,
                    offset: (currPage - 1) * PAGE_LIMIT,
                },
            })
        }

        if (paramSearchOpen === 'true' && paramWerkingsgebied) {
            mutate({
                data: {
                    Area_List: [paramWerkingsgebied],
                    Object_Types: selectedFilters.mapSearch,
                },
                params: {
                    limit: PAGE_LIMIT,
                    offset: (currPage - 1) * PAGE_LIMIT,
                },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        paramSearchOpen,
        paramWerkingsgebied,
        UUIDs,
        mapInstance,
        currPage,
        filter,
    ])

    return (
        <Transition
            show={searchOpen}
            enter="transition-all ease-out duration-300 delay-100 transform"
            enterFrom="-mr-840"
            enterTo="mr-0"
            leave="transition-all ease-in duration-300 transform"
            leaveFrom="mr-0"
            leaveTo="-mr-840"
            className="relative w-full max-w-2xl px-4 pt-4 pb-4 overflow-hidden lg:px-20 md:px-10 md:pb-0 md:shadow-pane z-1">
            <div className="pb-3 border-b">
                <div className="flex items-start justify-between">
                    <div>
                        <Heading level="3">Resultaten</Heading>
                        {!isLoading && !geoLoading ? (
                            <span className="block text-sm text-opacity-50 text-pzh-blue-dark">
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
            <div className="h-full mt-2">
                <div
                    ref={resultsContainer}
                    className="h-full pb-8 md:pb-24 pt-4 md:overflow-auto">
                    {!isLoading && !geoLoading ? (
                        <>
                            {data?.results.length ? (
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
                                    onChange={handlePageChange}
                                    forcePage={currPage - 1}
                                    {...pagination}
                                />
                            </div>
                        )}
                </div>
            </div>
        </Transition>
    )
}

export default SidebarResults
