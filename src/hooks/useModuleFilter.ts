import { useReducer } from 'react'

/**
 * Custom useHook that implements the logic to filter based on:
 * - Status of policies
 * - Type of policies
 */
const useModuleFilter = () => {
    const filterReducer = (state: any, action: any) => {
        switch (action.type) {
            case 'init':
                const policies = action.policies
                const availableTypes = policies.map(
                    (policy: any) => policy.Object.Status
                )
                state.statusFilters = [
                    'Filter op status',
                    ...(new Set(availableTypes) as any),
                ]
                return { ...state }
            case 'changeValue':
                state[action.property] = action.newValue
                return { ...state }
            default:
                throw new Error()
        }
    }

    const [filters, setFilters] = useReducer(filterReducer, {
        statusFilters: ['Filter op status'],
        selectedStatus: 'Filter op status',
        typeFilters: ['Filter op beleid', 'Beleidskeuze', 'Maatregel'],
        selectedType: 'Filter op beleid',
    })

    const getObjectType = (obj: any) =>
        obj.Object.hasOwnProperty('Aanleiding') ? 'Beleidskeuze' : 'Maatregel'

    const filterPolicies = (policy: any, filters: any) => {
        const activeStatusFilter = filters.selectedStatus !== 'Filter op status'
        const activeTypeFilter = filters.selectedType !== 'Filter op beleid'

        const getFilteredOutByStatus = () => {
            if (!activeStatusFilter) return false
            return policy.Object.Status !== filters.selectedStatus
        }

        const getFilteredOutByType = () => {
            if (!activeTypeFilter) return false
            return getObjectType(policy) !== filters.selectedType
        }

        const filteredOutByStatus = getFilteredOutByStatus()
        const filteredOutByType = getFilteredOutByType()

        return !filteredOutByStatus && !filteredOutByType
    }

    return [filters, setFilters, filterPolicies]
}

export default useModuleFilter
