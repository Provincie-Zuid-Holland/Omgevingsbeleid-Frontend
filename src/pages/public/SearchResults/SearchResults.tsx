import {
    FieldCheckboxGroup,
    Heading,
    Pagination,
    Text,
} from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import classNames from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useShallow } from 'zustand/react/shallow'

import { useSearchGetMssqlValidSearch } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderSpinner } from '@/components/Loader'
import SearchBar from '@/components/SearchBar'
import SearchResultItem from '@/components/SearchResultItem'
import { ModelType } from '@/config/objects/types'
import useSearchParams from '@/hooks/useSearchParam'
import useFilterStore from '@/store/filterStore'

const META = {
    title: 'Zoekresultaten',
    description: 'Zoek binnen de website van het Omgevingsbeleid.',
}

const PAGE_LIMIT = 10

const SearchResults = () => {
    const { get, set, remove } = useSearchParams()
    const [query, page, filter] = get(['query', 'page', 'filter'])

    const { filters, setSelectedFilters } = useFilterStore(
        useShallow(state => ({
            filters: state.filters,
            setSelectedFilters: state.setSelectedFilters,
        }))
    )

    const selectedFilters = useMemo(
        () => (!!filter && filter?.split(',')) || [],
        [filter]
    )

    const [currPage, setCurrPage] = useState(parseInt(page || '1'))

    const allFilters = useMemo(
        () =>
            filters.flatMap(group => group.options.map(filter => filter.value)),
        [filters]
    )

    /**
     * Handle filter change
     */
    const onFilterChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.currentTarget
        const newValue = [...selectedFilters]

        if (target.checked) {
            newValue.push(target.value as ModelType)
        } else {
            newValue.splice(
                newValue.findIndex(item => item === target.value),
                1
            )
        }

        setSelectedFilters('search', newValue as ModelType[])
        set('filter', newValue)

        mutate({
            data: {
                Object_Types: !!newValue.length ? newValue : allFilters,
            },
            params: {
                query: query || '',
                limit: PAGE_LIMIT,
                offset: (currPage - 1) * PAGE_LIMIT,
            },
        })

        setCurrPage(1)
        remove('page')
    }

    /**
     * Handle pagination
     */
    const handlePageChange = (page: number) => {
        setCurrPage(page)
        set('page', page.toString())
    }

    const { data, mutate, isPending, isError } = useSearchGetMssqlValidSearch({
        mutation: {
            onSuccess(data) {
                if (!!!data.results.length) {
                    setPagination({
                        isLoaded: false,
                        total: data?.total,
                        limit: data?.limit,
                    })
                } else {
                    if (
                        !pagination.isLoaded ||
                        data.total !== pagination.total
                    ) {
                        setPagination({
                            isLoaded: true,
                            total: data?.total,
                            limit: data?.limit,
                        })
                    }
                }
            },
        },
    })

    const [pagination, setPagination] = useState({
        isLoaded: false,
        total: data?.total,
        limit: data?.limit,
    })

    useEffect(() => {
        mutate({
            data: {
                Object_Types: !!selectedFilters.length
                    ? selectedFilters
                    : allFilters,
            },
            params: {
                query: query || '',
                limit: PAGE_LIMIT,
                offset: (currPage - 1) * PAGE_LIMIT,
            },
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, currPage])

    useUpdateEffect(() => {
        setCurrPage(1)
        remove('page')
    }, [query])

    return (
        <>
            <Helmet title={META.title}>
                <meta name="description" content={META.description} />
                <meta name="og:description" content={META.description} />
            </Helmet>

            <div className="bg-pzh-blue-500">
                <Container className="h-24 items-center">
                    <div className="col-span-2">
                        <Heading
                            level="1"
                            size="xxl"
                            color="text-pzh-white"
                            className="-mb-1">
                            Zoeken
                        </Heading>
                    </div>
                    <div className="col-span-4">
                        <SearchBar
                            defaultValue={query || ''}
                            callBack={() =>
                                setPagination({
                                    ...pagination,
                                    isLoaded: false,
                                })
                            }
                        />
                    </div>
                </Container>
            </div>

            <Container className="relative pt-8 pb-20">
                <div className="col-span-2">
                    <div className="sticky top-[120px]">
                        {filters.map((filter, index) => (
                            <div
                                key={filter.label}
                                className={classNames({
                                    'mb-6': index + 1 !== filters.length,
                                })}>
                                <Text bold className="text-pzh-blue-500 mb-3">
                                    {filter.label}
                                </Text>

                                <FieldCheckboxGroup
                                    name={filter.label}
                                    options={filter.options}
                                    value={selectedFilters}
                                    onChange={onFilterChange}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-4">
                    {isPending ? (
                        <div className="flex justify-center">
                            <LoaderSpinner />
                        </div>
                    ) : !!data?.results.length ? (
                        <ul>
                            {data?.results.map(item => (
                                <SearchResultItem
                                    key={item.UUID}
                                    query={query || ''}
                                    {...item}
                                />
                            ))}
                        </ul>
                    ) : (
                        <span className="text-pzh-gray-600 italic">
                            Er zijn geen resultaten gevonden
                        </span>
                    )}

                    {!isError &&
                        !!pagination.total &&
                        !!pagination.limit &&
                        pagination.total > pagination.limit && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    key={query}
                                    onPageChange={handlePageChange}
                                    current={currPage}
                                    total={pagination.total}
                                    limit={pagination.limit}
                                />
                            </div>
                        )}
                </div>
            </Container>
        </>
    )
}

export default SearchResults
