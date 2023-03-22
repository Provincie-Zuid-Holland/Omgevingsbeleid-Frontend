import { FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import debounce from 'lodash.debounce'
import { useState } from 'react'

import { searchGet } from '@/api/fetchers'
import { SearchObject } from '@/api/fetchers.schemas'

type Option = {
    label: string
    value: string | number
}

interface DynamicObjectSearchProps {
    /** Gets called when selecting an option */
    onChange: (object?: SearchObject) => void
    /** Key of model */
    objectKey?: 'uuid' | 'id'
    /** Placeholder of field (optional) */
    placeholder?: string
}

const DynamicObjectSearch = ({
    onChange,
    objectKey = 'uuid',
    placeholder = 'Zoek op titel van beleidskeuze, maatregel, etc.',
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
                        label: object.Title || '',
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

    const key = objectKey === 'uuid' ? 'Object_UUID' : 'ID'

    return (
        <FormikSelect
            key={key}
            name={key}
            placeholder={placeholder}
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
        />
    )
}

export default DynamicObjectSearch
