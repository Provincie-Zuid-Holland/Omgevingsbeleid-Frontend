import { FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import debounce from 'lodash.debounce'
import { useState } from 'react'

import { searchGet } from '@/api/fetchers'

type Option = {
    label: string
    value: string
}

const ModuleObjectSearch = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const loadSuggestions = (
        query: string,
        callback: (options: Option[]) => void
    ) => {
        searchGet({ query })
            .then(data =>
                callback(
                    data.Objects.map(object => ({
                        label: object.Title || '',
                        value: object.UUID,
                    }))
                )
            )
            .catch(() => callback([]))
    }

    const handleSuggestions = debounce(loadSuggestions, 300)

    const handleInputChange = (val: string) => {
        setMenuOpen(!!val)
    }

    return (
        <FormikSelect
            key="Object_UUID"
            name="Object_UUID"
            placeholder="Zoek op titel van beleidskeuze, maatregel, etc."
            loadOptions={handleSuggestions}
            noOptionsMessage={() => 'Geen objecten gevonden'}
            menuIsOpen={menuOpen}
            optimized={false}
            onInputChange={handleInputChange}
            isAsync
            cacheOptions
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
