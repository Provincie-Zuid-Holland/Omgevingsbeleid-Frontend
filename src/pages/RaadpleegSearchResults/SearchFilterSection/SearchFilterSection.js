import { useEffect, useRef, useState } from "react"
import { useWindowSize, useSearchParam } from "react-use"

import LoaderCard from "../../../components/LoaderCard"
import FilterItem from "../FilterItem"

const SearchFilterSection = ({ loaded, onPageFilters, setOnPageFilters }) => {
    const container = useRef(null)
    const paramOnly = useSearchParam("only")

    const searchFilterCategories = {
        Omgevingsvisie: ["ambities", "beleidsdoelen", "beleidskeuzes"],
        Omgevingsprogramma: ["maatregelen"],
        Uitvoering: ["Beleidsregels"],
    }

    if (!loaded) {
        return (
            <div className="col-span-6 pr-24 mt-0 md:col-span-2 md:mt-4">
                <LoaderCard height="100" />
            </div>
        )
    } else if (paramOnly) {
        // If the user only searched for a specific type we don't need to show the filter section
        return null
    } else if (onPageFilters?.availableFilters?.length <= 1) {
        // Filters are not yet initialized or none are available
        return <div className="hidden md:col-span-2 md:block" />
    }

    return (
        <div ref={container} className="col-span-6 pt-0 md:col-span-2 md:pt-4">
            <div>
                {Object.keys(searchFilterCategories)
                    .filter((category) =>
                        onPageFilters.availableFilters.some((filter) =>
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
                                    .filter((filterCategory) =>
                                        searchFilterCategories[
                                            category
                                        ].includes(filterCategory)
                                    )
                                    .map((filter) => (
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
