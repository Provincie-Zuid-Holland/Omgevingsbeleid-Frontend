import { FieldSelect, FieldSelectProps } from '@pzh-ui/components'
import classNames from 'classnames'

import { ModelType } from '@/config/objects/types'

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
        <span className="absolute flex items-center justify-center z-1 pt-[4px] w-[24px] h-[24px] top-[-12px] right-[-12px] bg-pzh-blue-dark text-pzh-white rounded-full text-sm font-bold">
            {activeFilters}
        </span>
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
