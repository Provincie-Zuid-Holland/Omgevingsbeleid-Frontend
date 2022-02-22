import { useState } from 'react'

import { getSearch, getSearchGeo } from '@/api/fetchers'
import { GetSearch200Item } from '@/api/fetchers.schemas'
import Button from '@/components/Button'
import LoaderSpinner from '@/components/Loader/LoaderSpinner'
import useSearchParam from '@/hooks/useSearchParam'
import { ACTIONTYPE } from '@/hooks/useSearchResultFilters'

export interface PaginationProps {
    searchResults: GetSearch200Item[]
    setSearchResults: (searchResults: GetSearch200Item[]) => void
    setOnPageFilters: (action: ACTIONTYPE) => void
    UUIDs?: string[]
    limit?: number
}

function Pagination({
    searchResults,
    setSearchResults,
    setOnPageFilters,
    UUIDs,
    limit = 20,
}: PaginationProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [offset, setOffset] = useState(limit)
    const [show, setShow] = useState(true)

    const { get } = useSearchParam()
    const [paramTextQuery, paramOnly, paramGeo, paramWerkingsgebied] = get([
        'query',
        'only',
        'geoQuery',
        'werkingsgebied',
    ])

    const getResults = async () => {
        if ((paramGeo || paramWerkingsgebied) && UUIDs?.length) {
            return await getSearchGeo({
                query: paramWerkingsgebied || UUIDs.join(','),
                offset,
                limit,
                ...(paramOnly && { only: paramOnly }),
            })
        }

        if (paramTextQuery) {
            return await getSearch({
                query: paramTextQuery,
                offset,
                limit,
                ...(paramOnly && { only: paramOnly }),
            })
        }

        return []
    }

    const getNewSearchResults: () => void = async () => {
        if (!paramTextQuery && !paramGeo && !paramWerkingsgebied) return

        setIsLoading(true)

        const newSearchResults = await getResults()

        setOffset(offset + limit)
        setSearchResults([...searchResults, ...newSearchResults])
        setOnPageFilters({
            type: 'updateFilters',
            searchResultItems: [...searchResults, ...newSearchResults],
        })
        setIsLoading(false)

        if (newSearchResults.length < limit) setShow(false)
    }

    if (!show || searchResults.length < limit) return null

    return (
        <div className="flex items-center justify-center mb-16">
            {isLoading ? (
                <div>
                    <LoaderSpinner className="mr-2" />
                    <span>Resultaten worden geladen</span>
                </div>
            ) : (
                <Button
                    text="Meer resultaten Laden"
                    onClick={getNewSearchResults}
                />
            )}
        </div>
    )
}

export default Pagination