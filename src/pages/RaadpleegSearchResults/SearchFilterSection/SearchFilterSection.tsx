import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

import { FilterCollection, ACTIONTYPE } from '@/hooks/useSearchResultFilters'
import useSearchParam from '@/utils/useSearchParam'

import { LoaderCard } from '../../../components/Loader'
import FilterItem from '../FilterItem'

interface SearchFilterSection {
    loaded: boolean
    onPageFilters: FilterCollection
    setOnPageFilters: (action: ACTIONTYPE) => void
}

const SearchFilterSection = ({
    loaded,
    onPageFilters,
    setOnPageFilters,
}: SearchFilterSection) => {
    const container = useRef<HTMLDivElement>(null)
    const windowSize = useWindowSize()
    const [containerStyle, setContainerStyle] = useState({})
    const paramOnly = useSearchParam('only')

    /**
     * Make the filter section fixed when the user scrolls down (min width Tablet)
     */
    useEffect(() => {
        const handleScroll = () => {
            const windowScrollTop =
                window.pageYOffset || document.documentElement.scrollTop

            if (
                container.current &&
                windowScrollTop > container?.current?.offsetTop
            ) {
                const { offsetWidth, offsetHeight, offsetTop, offsetLeft } =
                    container.current

                const fixedStyle = {
                    width: offsetWidth,
                    height: offsetHeight,
                    top: offsetTop,
                    left: offsetLeft,
                    position: 'fixed',
                }

                setContainerStyle(fixedStyle)
            } else if (
                windowSize.width < 768 ||
                (container.current &&
                    windowScrollTop < container.current.offsetTop)
            ) {
                const relativeStyle = {
                    position: 'relative',
                }

                setContainerStyle(relativeStyle)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [windowSize])

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
        <div ref={container} className="col-span-6 pt-0 md:col-span-2 md:pt-4">
            <div style={containerStyle}>
                {Object.keys(searchFilterCategories)
                    .filter(category =>
                        onPageFilters.availableFilters.some(filter =>
                            searchFilterCategories[category].includes(filter)
                        )
                    )
                    .map((category, index) => (
                        <div key={`category-${index}`}>
                            <span className="mt-2 font-bold text-pzh-blue">
                                {category}
                            </span>
                            <ul id="filter-search-results" className="mb-4">
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
