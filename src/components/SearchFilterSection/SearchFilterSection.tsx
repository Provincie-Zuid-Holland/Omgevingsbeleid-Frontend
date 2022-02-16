import { useRef } from 'react'

import FilterItem from '@/components/FilterItem'
import { LoaderCard } from '@/components/Loader'
import useSearchParam from '@/hooks/useSearchParam'
import { FilterCollection, ACTIONTYPE } from '@/hooks/useSearchResultFilters'

interface SearchFilterSection {
    loaded: boolean
    onPageFilters: FilterCollection
    setOnPageFilters: (action: ACTIONTYPE) => void
    hideLabels?: boolean
}

const SearchFilterSection = ({
    loaded,
    onPageFilters,
    setOnPageFilters,
    hideLabels,
}: SearchFilterSection) => {
    const container = useRef<HTMLDivElement>(null)
    const [paramOnly] = useSearchParam('only')

    const searchFilterCategories: { [key: string]: string[] } = {
        Omgevingsvisie: ['ambities', 'beleidsdoelen', 'beleidskeuzes'],
        Omgevingsprogramma: ['maatregelen'],
        Uitvoering: ['Beleidsregels'],
    }

    if (!loaded) {
        return (
            <div className="col-span-6 pr-24 mt-0 md:col-span-2 md:mt-4">
                <LoaderCard height="100" />
            </div>
        )
    } else if (onPageFilters?.availableFilters?.length <= 1 || paramOnly) {
        // Filters are not yet initialized or none are available
        return <div className="hidden md:col-span-2 md:block" />
    }

    return (
        <div
            ref={container}
            className={`col-span-6 pt-0 md:col-span-2 ${
                !hideLabels ? 'md:pt-4' : ''
            }`}>
            <div className="sticky top-20">
                {Object.keys(searchFilterCategories)
                    .filter(category =>
                        onPageFilters.availableFilters.some(filter =>
                            searchFilterCategories[category].includes(filter)
                        )
                    )
                    .map((category, index) => (
                        <div key={`category-${index}`}>
                            {!hideLabels && (
                                <span className="mt-2 font-bold text-pzh-blue">
                                    {category}
                                </span>
                            )}
                            <ul
                                id="filter-search-results"
                                className={!hideLabels ? 'mb-4' : ''}>
                                {onPageFilters.availableFilters
                                    .filter(filterCategory =>
                                        searchFilterCategories[
                                            category
                                        ].includes(filterCategory)
                                    )
                                    .map(filter => (
                                        <FilterItem
                                            key={filter}
                                            count={
                                                onPageFilters.filterState[
                                                    filter
                                                ].count
                                            }
                                            setOnPageFilters={setOnPageFilters}
                                            checked={
                                                onPageFilters.filterState[
                                                    filter
                                                ].checked
                                            }
                                            item={filter}
                                        />
                                    ))}
                            </ul>
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default SearchFilterSection
