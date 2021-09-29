import React from "react"

/**
 * Custom useHook that implements the logic to filter based on:
 * - Status of policies
 * - Type of policies
 */
const useModuleFilter = () => {
    const filterReducer = (state, action) => {
        switch (action.type) {
            case "init":
                const policies = action.policies
                const availableTypes = policies.map(
                    (policy) => policy.Object.Status
                )
                state.statusFilters = ["Status", ...new Set(availableTypes)]
                return { ...state }
            case "changeValue":
                state[action.property] = action.newValue
                return { ...state }
            default:
                throw new Error()
        }
    }

    const [filters, setFilters] = React.useReducer(filterReducer, {
        statusFilters: ["Status"],
        selectedStatus: "Status",
        typeFilters: ["Filter op beleid", "Beleidskeuze", "Maatregel"],
        selectedType: "Filter op beleid",
    })

    const getObjectType = (obj) =>
        obj.Object.hasOwnProperty("Aanleiding") ? "Beleidskeuze" : "Maatregel"

    const filterPolicies = (policy, filters) => {
        const activeStatusFilter = filters.selectedStatus !== "Status"
        const activeTypeFilter = filters.selectedType !== "Filter op beleid"

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
