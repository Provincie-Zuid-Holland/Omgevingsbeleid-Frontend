import { useEffect, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'

import { LoaderCard } from './../../../components/Loader'
import FilterItem from './../FilterItem'

const SearchFilterSection = ({
    loaded,
    searchFiltersOnly,
    onPageFilters,
    filters,
    handleFilter,
}) => {
    const container = useRef(null)
    const windowSize = useWindowSize()
    const [containerStyle, setContainerStyle] = useState({})

    useEffect(() => {
        const handleScroll = () => {
            const windowScrollTop =
                window.pageYOffset || document.documentElement.scrollTop

            if (windowScrollTop > container?.current.offsetTop) {
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
                windowScrollTop < container.current.offsetTop
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

    const searchFilterCategories = {
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
    }

    return (
        <div ref={container} className="col-span-6 pt-0 md:col-span-2 md:pt-4">
            <div style={containerStyle}>
                {searchFiltersOnly === null &&
                onPageFilters?.filterArray?.length > 0
                    ? Object.keys(searchFilterCategories)
                          .filter(category =>
                              filters.some(filter =>
                                  searchFilterCategories[category].includes(
                                      filter
                                  )
                              )
                          )
                          .map((category, index) => (
                              <div key={`category-${index}`}>
                                  <span className="mt-2 font-bold text-pzh-blue">
                                      {category}
                                  </span>
                                  <ul
                                      id="filter-search-results"
                                      className="mb-4">
                                      {filters
                                          .filter(filterCategory =>
                                              searchFilterCategories[
                                                  category
                                              ].includes(filterCategory)
                                          )
                                          .map(filter => (
                                              <FilterItem
                                                  key={filter}
                                                  count={
                                                      onPageFilters[filter]
                                                          .count
                                                  }
                                                  handleFilter={handleFilter}
                                                  checked={
                                                      !onPageFilters[filter]
                                                          .checked
                                                  }
                                                  item={filter}
                                              />
                                          ))}
                                  </ul>
                              </div>
                          ))
                    : null}
            </div>
        </div>
    )
}

export default SearchFilterSection
