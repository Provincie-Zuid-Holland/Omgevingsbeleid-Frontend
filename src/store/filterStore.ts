import { create } from 'zustand'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'

type Filter = {
    label: string
    options: { label: string; value: ModelType; exclude?: FilterKey[] }[]
}[]

type FilterKey = 'network' | 'search' | 'mapSearch'

interface FilterState {
    /** All possible filters */
    filters: Filter
    /** Active filters */
    selectedFilters: {
        [key in FilterKey]: ModelType[]
    }
    /** Set active filters */
    setSelectedFilters: (key: FilterKey, selectedFilters?: ModelType[]) => void
}

const useFilterStore = create<FilterState>(set => ({
    filters: [
        {
            label: 'Omgevingsvisie',
            options: [
                {
                    label: models['ambitie']['defaults']['pluralCapitalize'],
                    value: 'ambitie',
                    exclude: ['mapSearch'],
                },
                {
                    label: models['beleidsdoel']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'beleidsdoel',
                    exclude: ['mapSearch'],
                },
                {
                    label: models['beleidskeuze']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'beleidskeuze',
                },
                {
                    label: models['visie_algemeen']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'visie_algemeen',
                    exclude: ['mapSearch'],
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
                {
                    label: models['gebiedsprogramma']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'gebiedsprogramma',
                    exclude: ['network', 'mapSearch'],
                },
                {
                    label: models['programma_algemeen']['defaults'][
                        'pluralCapitalize'
                    ],
                    value: 'programma_algemeen',
                    exclude: ['mapSearch'],
                },
            ],
        },
        // {
        //     label: 'Uitvoering',
        //     options: [
        //         {
        //             label: models['beleidsregel']['defaults'][
        //                 'pluralCapitalize'
        //             ],
        //             value: 'beleidsregel',
        //             exclude: ['network', 'mapSearch'],
        //         },
        //     ],
        // },
    ],
    selectedFilters: {
        network: ['ambitie', 'beleidsdoel', 'beleidskeuze', 'maatregel'],
        search: [],
        mapSearch: [],
    },
    setSelectedFilters: (key, selectedFilters) =>
        set(state => ({
            ...state,
            selectedFilters: {
                ...state.selectedFilters,
                [key]: selectedFilters,
            },
        })),
}))

export default useFilterStore
