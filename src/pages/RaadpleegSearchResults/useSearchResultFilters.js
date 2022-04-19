import { useReducer } from "react"

const useSearchResultFilters = () => {
    const initFilters = (searchResultItems, update, currentState) => {
        // In the filterArray we place all the types of objects we received from the API
        const availableFilters = []

        // In the filterState we place the types as properties. On those properties we place the metaData about the object type, e.g. the amount of items we have received in the response. The filterState will be set in state to display in the UI.
        const filterState = {}

        searchResultItems.forEach((item) => {
            // Create filter object with meta info about the filter type
            const filterObject = {
                name: item.Type || "",
                checked: update
                    ? currentState?.filterState[item.Type]?.checked
                    : false,
                count: 1,
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

    const filterReducer = (state, action) => {
        switch (action.type) {
            case "initFilters":
                return initFilters(action.searchResultItems, false, null)
            case "updateFilters":
                return initFilters(action.searchResultItems, true, state)
            case "toggleFilter":
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
    })

    return { onPageFilters, setOnPageFilters }
}

export default useSearchResultFilters
