import React from "react"

import LoaderCard from "./../../../components/LoaderCard"

import FilterItem from "./../FilterItem"

const SearchFilterSection = ({
    loaded,
    searchFiltersOnly,
    onPageFilters,
    filters,
    handleFilter,
}) => {
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
    }

    return (
        <div className="col-span-6 mt-0 md:col-span-2 md:mt-4">
            {searchFiltersOnly === null &&
            onPageFilters?.filterArray?.length > 0
                ? Object.keys(searchFilterCategories)
                      .filter((category) =>
                          filters.some((filter) =>
                              searchFilterCategories[category].includes(filter)
                          )
                      )
                      .map((category) => (
                          <div>
                              <span className="mt-2 font-bold text-pzh-blue">
                                  {category}
                              </span>
                              <ul id="filter-search-results" className="mb-4">
                                  {filters
                                      .filter((filterCategory) =>
                                          searchFilterCategories[
                                              category
                                          ].includes(filterCategory)
                                      )
                                      .map((filter) => (
                                          <FilterItem
                                              key={filter}
                                              count={
                                                  onPageFilters[filter].count
                                              }
                                              handleFilter={handleFilter}
                                              checked={
                                                  !onPageFilters[filter].checked
                                              }
                                              item={filter}
                                          />
                                      ))}
                              </ul>
                          </div>
                      ))
                : null}
        </div>
    )
}

export default SearchFilterSection
