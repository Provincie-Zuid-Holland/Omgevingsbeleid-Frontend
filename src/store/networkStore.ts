import { create } from 'zustand'

import { GraphVertice } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

type Filter = {
    label: string
    options: { label: string; value: ModelType }[]
}[]

interface NetworkState {
    /** All possible filters */
    filters: Filter
    /** Active filters */
    selectedFilters?: ModelType[]
    /** Set active filters */
    setSelectedFilters: (filters?: ModelType[]) => void
    /** Contains node (GraphVertice) which is currently active */
    activeNode?: GraphVertice
    /** Set active node (GraphVertice) */
    setActiveNode: (node?: GraphVertice) => void
    /** Contains connections which are connected to active node */
    activeConnections?: GraphVertice[]
    /** Set active connections based on active node */
    setActiveConnections: (activeConnections?: GraphVertice[]) => void
    /** Active tab */
    activeTab: 'visual' | 'textual'
    /** Set active tab */
    setActiveTab: (activeTab: 'visual' | 'textual') => void
}

const useNetworkStore = create<NetworkState>(set => ({
    filters: [
        {
            label: 'Omgevingsvisie',
            options: [
                {
                    label: models['ambitie']['defaults']['pluralCapitalize'],
                    value: 'ambitie',
                },
                {
                    label: models['beleidsdoel']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'beleidsdoel',
                },
                {
                    label: models['beleidskeuze']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'beleidskeuze',
                },
            ],
        },
        {
            label: 'Omgevingsprogramma',
            options: [
                {
                    label: models['maatregel']['defaults']['pluralCapitalize'],
                    value: 'maatregel',
                },
            ],
        },
    ],
    selectedFilters: ['ambitie', 'beleidsdoel', 'beleidskeuze', 'maatregel'],
    setSelectedFilters: selectedFilters =>
        set(state => ({
            ...state,
            selectedFilters,
        })),
    setActiveNode: activeNode => set(state => ({ ...state, activeNode })),
    setActiveConnections: activeConnections =>
        set(state => ({ ...state, activeConnections })),
    activeTab: 'visual',
    setActiveTab: activeTab => set(state => ({ ...state, activeTab })),
}))

export default useNetworkStore
