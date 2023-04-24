import { create } from 'zustand'

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
}))

export default useNetworkStore
