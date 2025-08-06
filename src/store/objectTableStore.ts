import { create } from 'zustand'

type FilterOption = { label?: string; value?: string }

interface Filters {
    Title: string
    Object_Type: FilterOption[]
    Action: FilterOption[]
}

const defaultFilters: Filters = {
    Title: '',
    Object_Type: [],
    Action: [],
}

const defaultSortBy = [{ id: 'Object_Type', desc: false }]

interface ObjectTableState {
    moduleStates: {
        [moduleId: number]: {
            filters: Filters
            sortBy: { id: string; desc: boolean }[]
        }
    }
    setFilter: (
        moduleId: number,
        key: keyof Filters,
        value: Filters[keyof Filters]
    ) => void
    setSortBy: (
        moduleId: number,
        sortBy: { id: string; desc: boolean }[]
    ) => void
    getFilters: (moduleId: number) => Filters
    getSortBy: (moduleId: number) => { id: string; desc: boolean }[]
}

const useObjectTableStore = create<ObjectTableState>((set, get) => ({
    moduleStates: {},
    setFilter: (moduleId, key, value) =>
        set(state => {
            const module = state.moduleStates[moduleId] || {
                filters: { ...defaultFilters },
                sortBy: [...defaultSortBy],
            }
            return {
                moduleStates: {
                    ...state.moduleStates,
                    [moduleId]: {
                        ...module,
                        filters: {
                            ...module.filters,
                            [key]: value,
                        },
                    },
                },
            }
        }),
    setSortBy: (moduleId, sortBy) =>
        set(state => {
            const module = state.moduleStates[moduleId] || {
                filters: { ...defaultFilters },
                sortBy: [...defaultSortBy],
            }
            return {
                moduleStates: {
                    ...state.moduleStates,
                    [moduleId]: {
                        ...module,
                        sortBy,
                    },
                },
            }
        }),
    getFilters: moduleId =>
        get().moduleStates[moduleId]?.filters ?? { ...defaultFilters },
    getSortBy: moduleId =>
        get().moduleStates[moduleId]?.sortBy ?? [...defaultSortBy],
}))

export default useObjectTableStore
