import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import debounce from 'lodash.debounce'
import { useState } from 'react'

import { searchGet } from '@/api/fetchers'
import { SearchObject } from '@/api/fetchers.schemas'

type Option = {
    label: JSX.Element
    value: string | number
}

interface DynamicObjectSearchProps
    extends Omit<FieldSelectProps, 'onChange' | 'name'> {
    /** Gets called when selecting an option */
    onChange: (object?: SearchObject) => void
    /** Key of model */
    objectKey?: 'uuid' | 'id'
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Label of field (optional) */
    label?: string
}

const DynamicObjectSearch = ({
    onChange,
    objectKey = 'uuid',
    placeholder = 'Zoek op titel van beleidskeuze, maatregel, etc.',
    label,
    ...rest
}: DynamicObjectSearchProps) => {
    const [suggestions, setSuggestions] = useState<SearchObject[]>([])

    const loadSuggestions = (
        query: string,
        callback: (options: Option[]) => void
    ) => {
        searchGet({ query })
            .then(data => {
                setSuggestions(data.Objects)
                callback(
                    data.Objects.map(object => ({
                        label: (
                            <div className="flex justify-between">
                                <span>{object.Title}</span>
                                <span className="capitalize text-pzh-gray-400">
                                    {object.Object_Type}
                                </span>
                            </div>
                        ),
                        value:
                            objectKey === 'uuid'
                                ? object.UUID
                                : object.Object_ID,
                    }))
                )
            })
            .catch(() => callback([]))
    }

    const handleSuggestions = debounce(loadSuggestions, 500)

    const handleChange = (val: unknown) =>
        onChange(
            suggestions.find(object =>
                objectKey === 'uuid'
                    ? object.UUID === val
                    : object.Object_ID === val
            )
        )

    const key = objectKey === 'uuid' ? 'Object_UUID' : 'Object_ID'

    return (
        <FormikSelect
            key={key}
            name={key}
            placeholder={placeholder}
            label={label}
            loadOptions={handleSuggestions}
            onChange={handleChange}
            noOptionsMessage={({ inputValue }) =>
                !inputValue
                    ? 'Start met typen om te zoeken'
                    : 'Geen objecten gevonden'
            }
            loadingMessage={() => 'Zoeken...'}
            isAsync
            cacheOptions
            isClearable
            optimized={false}
            components={{
                DropdownIndicator: () => (
                    <div className="mr-4">
                        <MagnifyingGlass
                            size={18}
                            className="text-pzh-blue-dark"
                        />
                    </div>
                ),
            }}
            {...rest}
        />
    )
}

export default DynamicObjectSearch
