import Text from '@/components/Text'
import { ACTIONTYPE } from '@/hooks/useSearchResultFilters'
import { DimensionType } from '@/types/dimensions'
import getDimensionsConstants from '@/utils/getDimensionsConstants'

interface FilterItemInterface {
    checked: boolean
    item: string
    count: number
    setOnPageFilters: (action: ACTIONTYPE) => void
}

const FilterItem = ({
    setOnPageFilters,
    checked,
    item,
    count,
}: FilterItemInterface) => {
    const dimensieContants = getDimensionsConstants(item as DimensionType)
    const titleSingular = dimensieContants.TITLE_SINGULAR
    const titlePlural = dimensieContants.TITLE_PLURAL

    return (
        <li key={item} className="mt-1 text-pzh-blue-dark">
            <label
                className="flex items-center cursor-pointer select-none"
                id={`filter-for-${titleSingular}`}>
                <input
                    className="mr-2 leading-tight text-indigo-600 cursor-pointer text-pzh-green hover:text-pzh-green-dark form-checkbox"
                    type="checkbox"
                    checked={!checked}
                    onChange={() => {
                        setOnPageFilters({ type: 'toggleFilter', name: item })
                    }}
                    name={item}
                />
                <Text type="span" className="pt-1">
                    {`${count === 1 ? titleSingular : titlePlural} (${count})`}
                </Text>
            </label>
        </li>
    )
}

export default FilterItem
