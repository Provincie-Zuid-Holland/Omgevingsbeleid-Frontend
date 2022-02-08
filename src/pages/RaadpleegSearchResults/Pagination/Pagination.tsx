import React, { useState } from 'react'

import { getSearch } from '@/api/fetchers'
import { GetSearch200Item } from '@/api/fetchers.schemas'
import Button from '@/components/Button'
import LoaderSpinner from '@/components/Loader/LoaderSpinner'
import { ACTIONTYPE } from '@/hooks/useSearchResultFilters'
import useSearchParam from '@/utils/useSearchParam'

export interface PaginationProps {
    searchResults: GetSearch200Item[]
    setSearchResults: (searchResults: GetSearch200Item[]) => void
    setOnPageFilters: (action: ACTIONTYPE) => void
}

function Pagination({
    searchResults,
    setSearchResults,
    setOnPageFilters,
}: PaginationProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [offset, setOffset] = useState(20)
    const [show, setShow] = useState(true)

    const paramTextQuery = useSearchParam('query')
    const paramOnly = useSearchParam('only')

    const getNewSearchResults: () => void = async () => {
        if (!paramTextQuery) return
        setIsLoading(true)
        const newSearchResults = await getSearch({
            query: paramTextQuery,
            offset: offset,
            limit: 20,
            ...(paramOnly && { only: paramOnly }),
        })
        setOffset(offset + 20)
        setSearchResults([...searchResults, ...newSearchResults])
        setOnPageFilters({
            type: 'updateFilters',
            searchResultItems: [...searchResults, ...newSearchResults],
        })
        setIsLoading(false)
        if (newSearchResults.length < 20) setShow(false)
    }

    if (!show) return null

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
