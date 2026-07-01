import { create } from 'zustand'

type TableStateId = string | number
type FilterOption = { label?: string; value?: string }

interface Filters {
    Title: string
    Object_Type: FilterOption[]
    Action: FilterOption[]
}

type SortBy = { id: string; desc: boolean }[]

interface Pagination {
    pageIndex: number
    pageSize: number
}

const PAGE_LIMIT = 50

const defaultFilters: Filters = {
    Title: '',
    Object_Type: [],
    Action: [],
}

const defaultSortBy: SortBy = [{ id: 'Object_Type', desc: false }]

const defaultPagination: Pagination = {
    pageIndex: 1,
    pageSize: PAGE_LIMIT,
}

interface ModuleState {
    filters: Filters
    sortBy: SortBy
    pagination: Pagination
}

interface ObjectTableState {
    moduleStates: Record<TableStateId, ModuleState>

    setFilter: (
        moduleId: TableStateId,
        key: keyof Filters,
        value: Filters[keyof Filters]
    ) => void

    setSortBy: (moduleId: TableStateId, sortBy: SortBy) => void
    setPagination: (
        moduleId: TableStateId,
        pagination: Pagination | ((pagination: Pagination) => Pagination)
    ) => void

    getFilters: (moduleId: TableStateId) => Filters
    getSortBy: (moduleId: TableStateId) => SortBy
    getPagination: (moduleId: TableStateId) => Pagination
}

const getDefaultModuleState = (): ModuleState => ({
    filters: { ...defaultFilters },
    sortBy: [...defaultSortBy],
    pagination: { ...defaultPagination },
})

const useObjectTableStore = create<ObjectTableState>((set, get) => ({
    moduleStates: {},

    setFilter: (moduleId, key, value) =>
        set(state => {
            const module =
                state.moduleStates[moduleId] ?? getDefaultModuleState()

            return {
                moduleStates: {
                    ...state.moduleStates,
                    [moduleId]: {
                        ...module,
                        filters: {
                            ...module.filters,
                            [key]: value,
                        },
                        pagination: {
                            ...module.pagination,
                            pageIndex: 1,
                        },
                    },
                },
            }
        }),

    setSortBy: (moduleId, sortBy) =>
        set(state => {
            const module =
                state.moduleStates[moduleId] ?? getDefaultModuleState()

            return {
                moduleStates: {
                    ...state.moduleStates,
                    [moduleId]: {
                        ...module,
                        sortBy,
                        pagination: {
                            ...module.pagination,
                            pageIndex: 1,
                        },
                    },
                },
            }
        }),

    setPagination: (moduleId, pagination) =>
        set(state => {
            const module =
                state.moduleStates[moduleId] ?? getDefaultModuleState()

            const nextPagination =
                typeof pagination === 'function'
                    ? pagination(module.pagination)
                    : pagination

            return {
                moduleStates: {
                    ...state.moduleStates,
                    [moduleId]: {
                        ...module,
                        pagination: nextPagination,
                    },
                },
            }
        }),

    getFilters: moduleId =>
        get().moduleStates[moduleId]?.filters ?? { ...defaultFilters },

    getSortBy: moduleId =>
        get().moduleStates[moduleId]?.sortBy ?? [...defaultSortBy],

    getPagination: moduleId =>
        get().moduleStates[moduleId]?.pagination ?? { ...defaultPagination },
}))

export default useObjectTableStore
