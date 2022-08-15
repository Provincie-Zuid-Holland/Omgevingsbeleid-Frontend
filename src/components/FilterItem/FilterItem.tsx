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
        <li className="mt-1 text-pzh-blue-dark">
            <div className="flex items-center">
                <input
                    onChange={() => {
                        setOnPageFilters({
                            type: 'toggleFilter',
                            name: item,
                            newState: !checked,
                        })
                    }}
                    className="mr-2 leading-tight cursor-pointer text-pzh-green hover:text-pzh-green-dark form-checkbox"
                    type="checkbox"
                    checked={checked}
                    name={`filter-item-${item}`}
                    id={`filter-item-${item}`}
                />
                <label
                    style={{ fontSize: '1rem', lineHeight: '1.5rem' }}
                    className={`pt-1 cursor-pointer`}
                    id={`filter-for-${titleSingular}`}
                    htmlFor={`filter-item-${item}`}>
                    {`${count === 1 ? titleSingular : titlePlural} (${count})`}
                </label>
            </div>
        </li>
    )
}

export default FilterItem
