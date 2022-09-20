import { FieldCheckbox } from '@pzh-ui/components'

import useSearchFilterStore from '@/hooks/useSearchFilterStore'
import { DimensionType } from '@/types/dimensions'
import getDimensionsConstants from '@/utils/getDimensionsConstants'

interface FilterItemInterface {
    item: string
}

const FilterItem = ({ item }: FilterItemInterface) => {
    const dimensieContants = getDimensionsConstants(item as DimensionType)
    const titleSingular = dimensieContants.TITLE_SINGULAR
    const titlePlural = dimensieContants.TITLE_PLURAL

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
                    {`${count === 1 ? titleSingular : titlePlural} (${count})`}
                </FieldCheckbox>
            </div>
        </li>
    )
}

export default FilterItem
