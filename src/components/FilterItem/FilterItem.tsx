import { FieldCheckbox } from '@pzh-ui/components'

import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useSearchFilterStore from '@/hooks/useSearchFilterStore'

export interface FilterItemProps {
    item: string
}

const FilterItem = ({ item }: FilterItemProps) => {
    const model = models[item as ModelType]

    const { filterState, toggleFilter } = useSearchFilterStore(state => ({
        filterState: state.filterState,
        toggleFilter: state.toggleFilter,
    }))

    const { checked, count } = filterState[item]

    return (
        <li className="mt-1 text-pzh-blue-dark">
            <div className="flex items-center">
                <FieldCheckbox
                    checked={checked}
                    onChange={() => toggleFilter(item)}>
                    {`${
                        count === 1
                            ? model.defaults.singularReadable
                            : model.defaults.plural
                    } (${count})`}
                </FieldCheckbox>
            </div>
        </li>
    )
}

export default FilterItem
