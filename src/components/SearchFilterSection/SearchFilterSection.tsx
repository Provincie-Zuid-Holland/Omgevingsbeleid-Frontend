import { useMemo, useRef } from 'react'

import FilterItem from '@/components/FilterItem'
import { LoaderCard } from '@/components/Loader'
import useSearchFilterStore from '@/hooks/useSearchFilterStore'
import useSearchParam from '@/hooks/useSearchParam'

interface SearchFilterSection {
    loaded: boolean
    searchResults?: any[]
    hideLabels?: boolean
}

const SearchFilterSection = ({ loaded, hideLabels }: SearchFilterSection) => {
    const container = useRef<HTMLDivElement>(null)
    const { get } = useSearchParam()
    const [paramOnly] = get('only')

    const availableFilters = useSearchFilterStore(
        state => state.availableFilters
    )

    const searchFilterCategories: { [key: string]: string[] } = useMemo(
        () => ({
            Omgevingsvisie: ['ambities', 'beleidsdoelen', 'beleidskeuzes'],
            Omgevingsprogramma: ['maatregelen'],
            Uitvoering: ['Beleidsregels'],
        }),
        []
    )

    const availableCategories = useMemo(() => {
        return Object.keys(searchFilterCategories).filter(category =>
            availableFilters.some(filter =>
                searchFilterCategories[category].includes(filter)
            )
        )
    }, [availableFilters, searchFilterCategories])

    if (!loaded) {
        return (
            <div className="col-span-6 pr-24 mt-0 md:col-span-2 md:mt-4">
                <LoaderCard height="100" />
            </div>
        )
    } else if (availableFilters.length <= 1 || paramOnly) {
        // Filters are not yet initialized or none are available
        return <div className="hidden md:col-span-2 md:block" />
    }

    return (
        <div
            ref={container}
            className={`col-span-6 pt-0 md:col-span-2 ${
                !hideLabels ? 'md:pt-4' : ''
            }`}>
            <div className="md:sticky" style={{ top: 'calc(2rem+192px)' }}>
                {availableCategories.map((category, index) => (
                    <div key={`category-${index}`}>
                        {!hideLabels && (
                            <span className="mt-2 font-bold text-pzh-blue">
                                {category}
                            </span>
                        )}
                        <ul className={!hideLabels ? 'mb-4' : ''}>
                            {availableFilters
                                .filter(filterCategory =>
                                    searchFilterCategories[category].includes(
                                        filterCategory
                                    )
                                )
                                .map(filter => (
                                    <FilterItem key={filter} item={filter} />
                                ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchFilterSection
