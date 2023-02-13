import { useReducer } from 'react'
import { useLocation } from 'react-router-dom'

import { GetGraph200, GetGraph200NodesItem } from '@/api/fetchers.schemas'
import networkGraphFilterMenu from '@/constants/networkGraphFilterMenu'

type ACTIONTYPE =
    | { type: 'init'; data: GetGraph200 | null }
    | { type: 'toggleFilter'; filterType: string; newState: boolean }

const useNetworkGraphFilters = () => {
    const { state } = useLocation()
    const lastLocation = (state as any)?.from

    /**
     * Reducer for the filters
     * @param {object} state - Contains the current state
     * @param {object} action - Contains the type of action and the data
     */
    const setFiltersReducer = (
        state: { [key: string]: boolean },
        action: ACTIONTYPE
    ) => {
        /**
         * @param {array} nodes - Array containing the d3 node objects
         * @returns An object containing all the type on keys and a boolean as value, indicating if the filter is on or off
         */
        const getFiltersFromData = (
            nodes: GetGraph200NodesItem[] | undefined
        ) => {
            if (!nodes) return {}

            const filterTypes: string[] = [] // Contains the types that are present in the nodes
            const filterState: { [key: string]: boolean } = {} // The state we will return in the format {'Beleidskeuze': true}

            const getInitialFilterState = (type: string) =>
                networkGraphFilterMenu.Visie.includes(type)

            const addNodeType = (type: string) => {
                filterTypes.push(type)
                filterState[type] = getInitialFilterState(type)
            }

            nodes.forEach(node =>
                filterTypes.includes(node.Type!)
                    ? null
                    : addNodeType(node.Type!)
            )

            if (lastLocation?.includes('verordening')) {
                filterState.verordeningen = true
            }

            return filterState
        }

        switch (action.type) {
            case 'init':
                if (action.data === null) {
                    return {}
                } else {
                    return getFiltersFromData(action.data.nodes)
                }

            case 'toggleFilter':
                const filterType = action.filterType
                const newState = action.newState
                state[filterType] = newState
                return { ...state }

            default:
                throw new Error('No type declared')
        }
    }

    const [filters, setFilters] = useReducer(setFiltersReducer, {})

    return [filters, setFilters] as const
}

export default useNetworkGraphFilters
