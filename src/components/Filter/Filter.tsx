import { FieldSelect, FieldSelectProps } from '@pzh-ui/components'
import classNames from 'clsx'

import { ModelType } from '@/config/objects/types'
import Indicator from '../Indicator'

interface FilterProps extends Omit<FieldSelectProps, 'name'> {
    filters: {
        options: {
            label: string
            value: ModelType
        }[]
        label: string
    }[]
    defaultValue?: {
        label: string
        value: ModelType
    }[]
    activeFilters: number
    handleChange: (e: { label: string; value: ModelType }[]) => void
    className?: string
}

const Filter = ({
    filters,
    activeFilters,
    defaultValue,
    handleChange,
    className,
    ...rest
}: FilterProps) => (
    <div className={classNames('relative', className)}>
        <Indicator
            amount={activeFilters}
            className="border-pzh-blue-500 bg-pzh-blue-500 text-pzh-white absolute -top-3 -right-3 z-[1]"
        />
        <FieldSelect
            data-testid="filter-type"
            name="Filter"
            placeholder="Filter op type"
            options={filters}
            value={defaultValue}
            onChange={val =>
                handleChange(val as { label: string; value: ModelType }[])
            }
            isMulti
            isClearable={false}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isSearchable={false}
            controlShouldRenderValue={false}
            styles={{
                menuList: base => ({
                    ...base,
                    maxHeight: 'auto',
                }),
            }}
            {...rest}
        />
    </div>
)

export default Filter
