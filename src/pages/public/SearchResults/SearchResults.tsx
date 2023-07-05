import {
    FieldCheckboxGroup,
    Heading,
    Pagination,
    Text,
} from '@pzh-ui/components'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useUpdateEffect } from 'react-use'

import { useSearchValidPost } from '@/api/fetchers'
import { Container } from '@/components/Container'
import { LoaderSpinner } from '@/components/Loader'
import SearchBar from '@/components/SearchBar'
import SearchResultItem from '@/components/SearchResultItem'
import { ModelType } from '@/config/objects/types'
import { default as useSearchParams } from '@/hooks/useSearchParam'
import useFilterStore from '@/store/filterStore'

const PAGE_LIMIT = 10

const SearchResults = () => {
    const { get, set, remove } = useSearchParams()
    const [query, page] = get(['query', 'page'])

    const filters = useFilterStore(state => state.filters)
    const selectedFilters = useFilterStore(
        state => state.selectedFilters.search
    )
    const setSelectedFilters = useFilterStore(state => state.setSelectedFilters)

    const [currPage, setCurrPage] = useState(parseInt(page || '1'))

    /** Handle filter change */
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

        setSelectedFilters('search', newValue)
        set('filter', newValue)
    }

    const { data, mutate, isLoading } = useSearchValidPost({
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

    const handlePageChange = (page: number) => {
        setCurrPage(page)
        set('page', page.toString())
    }

    return (
        <>
            <Helmet title="Zoekresultaten" />

            <Container className="h-[96px] items-center bg-pzh-blue">
                <div className="col-span-2">
                    <Heading level="2" as="1" color="-mb-1 text-pzh-white">
                        Zoeken
                    </Heading>
                </div>
                <div className="col-span-4">
                    <SearchBar
                        defaultValue={query || ''}
                        callBack={() =>
                            setPagination({ ...pagination, isLoaded: false })
                        }
                    />
                </div>
            </Container>

            <Container className="pt-8 pb-20 relative">
                <div className="col-span-2">
                    <div className="sticky top-[120px]">
                        {filters.map((filter, index) => (
                            <div
                                key={filter.label}
                                className={classNames({
                                    'mb-6': index + 1 !== filters.length,
                                })}>
                                <Text
                                    type="body-bold"
                                    className="mb-3 text-pzh-blue">
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
                    {isLoading ? (
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
                        <span className="italic text-pzh-gray-600">
                            Er zijn geen resultaten
                        </span>
                    )}

                    {!!pagination.total &&
                        !!pagination.limit &&
                        pagination.total > pagination.limit && (
                            <div className="mt-8 flex justify-center">
                                <Pagination
                                    key={query}
                                    onChange={handlePageChange}
                                    forcePage={currPage - 1}
                                    {...pagination}
                                />
                            </div>
                        )}
                </div>
            </Container>
        </>
    )
}

export default SearchResults
