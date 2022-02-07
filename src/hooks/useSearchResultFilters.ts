import { useReducer } from 'react'

import { GetSearch200Item } from '@/api/fetchers.schemas'

interface FilterObjectInterface {
    checked: boolean
    count: number
    name: string
}

export interface FilterCollection {
    filterState: { [key: string]: FilterObjectInterface }
    availableFilters: string[]
}

export type ACTIONTYPE =
    | { type: 'initFilters'; searchResultItems: GetSearch200Item[] }
    | { type: 'toggleFilter'; name: string; newState: boolean }
    | { type: 'updateFilters'; searchResultItems: GetSearch200Item[] }

const useSearchResultFilters = () => {
    const initFilters = (
        searchResultItems: GetSearch200Item[],
        update?: boolean,
        currentState?: FilterCollection
    ) => {
        // In the filterArray we place all the types of objects we received from the API
        const availableFilters: string[] = []

        // In the filterState we place the types as properties. On those properties we place the metaData about the object type, e.g. the amount of items we have received in the response. The filterState will be set in state to display in the UI.
        const filterState: { [key: string]: FilterObjectInterface } = {}

        searchResultItems.forEach(item => {
            // Create filter object with meta info about the filter type
            const filterObject = {
                name: item.Type || '',
                count: 1,
                checked:
                    update && item.Type
                        ? currentState?.filterState[item.Type]?.checked || false
                        : false,
            }

            if (!item.Type) return null

            if (!availableFilters.includes(item.Type)) {
                // If we map over a new Type we push the Type into the availableFilters and initialize the filterObject as a property on the filterState
                availableFilters.push(item.Type)
                filterState[item.Type] = filterObject
            } else {
                // If it already exists we increase the count of this property
                filterState[item.Type].count++
            }
        })

        return { filterState, availableFilters }
    }

    const filterReducer = (
        state: FilterCollection,
        action: ACTIONTYPE
    ): FilterCollection => {
        switch (action.type) {
            case 'initFilters':
                const searchResultItems = action.searchResultItems
                return initFilters(searchResultItems)
            case 'updateFilters':
                return initFilters(action.searchResultItems, true, state)
            case 'toggleFilter':
                const name = action.name
                state.filterState[name].checked = action.newState
                return { ...state }
            default:
                throw new Error()
        }
    }

    const [onPageFilters, setOnPageFilters] = useReducer(filterReducer, {
        filterState: {},
        availableFilters: [],
    } as FilterCollection)

    return { onPageFilters, setOnPageFilters }
}

export default useSearchResultFilters
