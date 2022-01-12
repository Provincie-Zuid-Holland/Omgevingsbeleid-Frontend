import { useReducer } from 'react'

/**
 * Custom useHook that implements the logic to sort based on policy properties
 */
const useModuleSort = () => {
    const sortingReducer = (state, action) => {
        switch (action.type) {
            case 'toggle':
                state.activeSorting = action.property
                state[action.property] = !state[action.property]
                return { ...state }
            case 'reactivate':
                state.activeSorting = action.property
                return { ...state }
            default:
                throw new Error()
        }
    }
    const [sorting, setSorting] = useReducer(sortingReducer, {
        title: true,
        type: false,
        status: false,
        date: false,
        activeSorting: 'title',
    })

    const getObjectType = obj =>
        obj.Object.hasOwnProperty('Aanleiding') ? 'Beleidskeuze' : 'Maatregel'

    const sortPolicies = (a, b, sorting) => {
        if (sorting.activeSorting === 'title') {
            if (sorting.title) {
                return a.Object.Titel.localeCompare(b.Object.Titel)
            } else {
                return b.Object.Titel.localeCompare(a.Object.Titel)
            }
        } else if (sorting.activeSorting === 'type') {
            if (sorting.type) {
                return getObjectType(a).localeCompare(getObjectType(b))
            } else {
                return getObjectType(b).localeCompare(getObjectType(a))
            }
        } else if (sorting.activeSorting === 'status') {
            if (sorting.status) {
                return a.Object.Status.localeCompare(b.Object.Status)
            } else {
                return b.Object.Status.localeCompare(a.Object.Status)
            }
        } else if (sorting.activeSorting === 'date') {
            if (sorting.date) {
                return (
                    new Date(b.Object.Modified_Date) -
                    new Date(a.Object.Modified_Date)
                )
            } else {
                return (
                    new Date(a.Object.Modified_Date) -
                    new Date(b.Object.Modified_Date)
                )
            }
        } else {
            return 0
        }
    }

    return [sorting, setSorting, sortPolicies]
}

export default useModuleSort
