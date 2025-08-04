import { create } from 'zustand'

type FilterOption = { label?: string; value?: string }

interface ObjectTableState {
    filters: {
        Title: string
        Object_Type: FilterOption[]
        Action: FilterOption[]
    }
    sortBy: { id: string; desc: boolean }[]
    setFilter: <T extends keyof ObjectTableState['filters']>(
        key: T,
        value: ObjectTableState['filters'][T]
    ) => void
    setSortBy: (sortBy: { id: string; desc: boolean }[]) => void
    resetFilters: () => void
}

const useObjectTableStore = create<ObjectTableState>(set => ({
    filters: {
        Title: '',
        Object_Type: [],
        Action: [],
    },
    sortBy: [{ id: 'Object_Type', desc: false }],
    setFilter: (key, value) =>
        set(state => ({
            filters: {
                ...state.filters,
                [key]: value,
            },
        })),
    setSortBy: sortBy => set({ sortBy }),
    resetFilters: () =>
        set({
            filters: {
                Title: '',
                Object_Type: [],
                Action: [],
            },
        }),
}))

export default useObjectTableStore
