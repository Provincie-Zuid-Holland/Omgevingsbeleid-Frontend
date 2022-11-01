import create from 'zustand'

import {
    GetSearch200ResultsItem,
    GetSearchGeo200ResultsItem,
} from '@/api/fetchers.schemas'

interface FilterObjectInterface {
    checked: boolean
    count: number
    name: string
}

interface FilterStore {
    filterState: {
        [key: string]: FilterObjectInterface
    }
    availableFilters: string[]
    initializeFilters: (
        searchResultItems: GetSearch200ResultsItem[],
        update?: boolean,
        filter?: string | null
    ) => void
    toggleFilter: (name: string) => void
}

const generateAvailableFilters = (
    searchResultItems: GetSearch200ResultsItem[]
) => {
    const availableFilters: string[] = []

    searchResultItems.forEach(item => {
        if (item.Type && !availableFilters.includes(item.Type)) {
            availableFilters.push(item.Type)
        }
    })

    return availableFilters
}

const generateFilterState = (
    searchResultItems: GetSearch200ResultsItem[],
    update?: boolean,
    filter?: string | null,
    state?: FilterStore
) => {
    const mappedTypes: string[] = []
    const filterState: { [key: string]: FilterObjectInterface } = {}

    searchResultItems.forEach(item => {
        // Create filter object with meta info about the filter type
        const filterObject = {
            name: item.Type || '',
            count: 1,
            checked:
                (update && item.Type && state && state.filterState[item.Type]
                    ? state.filterState[item.Type].checked || false
                    : false) ||
                (filter?.length && item.Type
                    ? filter?.includes(item.Type)
                    : false),
        }

        if (item.Type && !mappedTypes.includes(item.Type)) {
            mappedTypes.push(item.Type)
            filterState[item.Type] = filterObject
        } else if (item.Type) {
            filterState[item.Type].count++
        }
    })

    return filterState
}

const useSearchFilterStore = create<FilterStore>(set => ({
    filterState: {},
    availableFilters: [],
    initializeFilters: (
        searchResultItems:
            | GetSearch200ResultsItem[]
            | GetSearchGeo200ResultsItem[],
        update?: boolean,
        filter?: string | null
    ) =>
        set(state => ({
            ...state,
            availableFilters: generateAvailableFilters(searchResultItems),
            filterState: generateFilterState(
                searchResultItems,
                update,
                filter,
                state
            ),
        })),
    toggleFilter: name =>
        set(state => ({
            ...state,
            filterState: {
                ...state.filterState,
                [name]: {
                    ...state.filterState[name],
                    checked: !state.filterState[name].checked,
                },
            },
        })),
}))

export default useSearchFilterStore
