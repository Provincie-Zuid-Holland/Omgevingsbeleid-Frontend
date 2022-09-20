import { Button } from '@pzh-ui/components'
import { useState } from 'react'

import { getSearch, postSearchGeo } from '@/api/fetchers'
import {
    GetSearch200ResultsItem,
    GetSearchGeo200ResultsItem,
} from '@/api/fetchers.schemas'
import LoaderSpinner from '@/components/Loader/LoaderSpinner'
import useSearchFilterStore from '@/hooks/useSearchFilterStore'
import useSearchParam from '@/hooks/useSearchParam'

export interface PaginationProps {
    searchResults: GetSearch200ResultsItem[] | GetSearchGeo200ResultsItem[]
    setSearchResults: (
        searchResults: GetSearch200ResultsItem[] | GetSearchGeo200ResultsItem[]
    ) => void
    UUIDs?: string[]
    limit?: number
    total?: number
}

function Pagination({
    searchResults,
    setSearchResults,
    UUIDs,
    limit = 20,
    total = 0,
}: PaginationProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [offset, setOffset] = useState(limit)
    const [show, setShow] = useState(true)
    const initializeFilters = useSearchFilterStore(
        state => state.initializeFilters
    )

    const { get } = useSearchParam()
    const [paramTextQuery, paramOnly, paramGeo, paramWerkingsgebied, filter] =
        get(['query', 'only', 'geoQuery', 'werkingsgebied', 'filter'])

    const getResults = async () => {
        if ((paramGeo || paramWerkingsgebied) && UUIDs?.length) {
            return await postSearchGeo({
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
    }

    const getNewSearchResults: () => void = async () => {
        if (!paramTextQuery && !paramGeo && !paramWerkingsgebied) return

        setIsLoading(true)

        const { results: newSearchResults = [], total = 0 } =
            (await getResults()) || {}

        setOffset(offset + limit)
        initializeFilters([...searchResults, ...newSearchResults], true, filter)
        setSearchResults([...searchResults, ...newSearchResults])
        setIsLoading(false)

        if (searchResults.length + newSearchResults.length >= total)
            setShow(false)
    }

    if (!show || total <= limit) return null

    return (
        <div className="flex items-center justify-center mb-16">
            {isLoading ? (
                <div>
                    <LoaderSpinner className="mr-2" />
                    <span>Resultaten worden geladen</span>
                </div>
            ) : (
                <Button
                    label="Meer resultaten laden"
                    onClick={getNewSearchResults}
                />
            )}
        </div>
    )
}

export default Pagination
