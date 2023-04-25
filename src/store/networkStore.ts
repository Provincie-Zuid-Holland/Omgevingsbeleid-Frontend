import { create } from 'zustand'

import { GraphVertice } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

type Filter = {
    label: string
    options: { label: string; value: ModelType }[]
}[]

interface NetworkState {
    filters: Filter
    selectedFilters?: ModelType[]
    setSelectedFilters: (filters?: ModelType[]) => void
    activeNode?: GraphVertice
    setActiveNode: (node?: GraphVertice) => void
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
}))

export default useNetworkStore
