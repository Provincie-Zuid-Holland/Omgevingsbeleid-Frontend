import { FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import debounce from 'lodash.debounce'
import { useState } from 'react'

import { searchGet } from '@/api/fetchers'
import { SearchObject } from '@/api/fetchers.schemas'

type Option = {
    label: string
    value: string
}

interface ModuleObjectSearchProps {
    onChange: (object?: SearchObject) => void
}

const ModuleObjectSearch = ({ onChange }: ModuleObjectSearchProps) => {
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
                        value: object.UUID,
                    }))
                )
            })
            .catch(() => callback([]))
    }

    const handleSuggestions = debounce(loadSuggestions, 500)

    const handleChange = (val: unknown) =>
        onChange(suggestions.find(object => object.UUID === val))

    return (
        <FormikSelect
            key="Object_UUID"
            name="Object_UUID"
            placeholder="Zoek op titel van beleidskeuze, maatregel, etc."
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

export default ModuleObjectSearch
