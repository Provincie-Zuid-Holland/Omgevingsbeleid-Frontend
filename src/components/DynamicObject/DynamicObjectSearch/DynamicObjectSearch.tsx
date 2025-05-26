import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useState } from 'react'

import { searchPost, searchValidPost } from '@/api/fetchers'
import { SearchObject, ValidSearchObject } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'

type Option = {
    label: JSX.Element
    value: string | number
    object?: SearchObject
}

export interface DynamicObjectSearchProps
    extends Omit<FieldSelectProps, 'onChange' | 'name'> {
    /** Gets called when selecting an option */
    onChange?: (object?: Option | Option[] | null) => void
    /** Key of model */
    objectKey?:
        | 'Object_UUID'
        | 'Object_ID'
        | 'Hierarchy_Code'
        | 'Werkingsgebied_Code'
        | 'Document_Code'
    /** Name of field */
    fieldName?: string
    /** Placeholder of field (optional) */
    placeholder?: string
    /** Label of field (optional) */
    label?: string
    /** Filter items by UUID or Object_ID */
    filter?: number | string | number[] | string[]
    /** Filter items by Object_Type */
    filterType?: ModelType[]
    /** Status of object */
    status?: 'valid' | 'all'
}

const DynamicObjectSearch = ({
    onChange,
    objectKey = 'Object_UUID',
    fieldName,
    placeholder = 'Zoek op titel van beleidskeuze, maatregel, etc.',
    filter,
    filterType,
    status = 'valid',
    ...rest
}: DynamicObjectSearchProps) => {
    const { setFieldValue } = useFormikContext()

    const [optionsState, setOptionsState] = useState<Option[]>([])

    const searchEndpoint = status === 'valid' ? searchValidPost : searchPost

    const loadSuggestions = (
        query: string,
        callback: (options: Option[]) => void
    ) => {
        searchEndpoint({ Object_Types: filterType }, { query, limit: 50 })
            .then(data => {
                let filteredObject = data.results

                if (filter) {
                    filteredObject = data.results.filter(object =>
                        Array.isArray(filter)
                            ? objectKey === 'Object_UUID'
                                ? !(filter as string[]).includes(object.UUID)
                                : !(filter as number[]).includes(
                                      object.Object_ID
                                  )
                            : objectKey === 'Object_UUID'
                            ? object.UUID !== filter
                            : object.Object_ID !== filter
                    )
                }

                const options = filteredObject.map(
                    (object: SearchObject | ValidSearchObject) => ({
                        label: (
                            <div className="flex justify-between gap-4">
                                <span>
                                    {object.Title}

                                    {'Module_ID' in object &&
                                        object.Module_ID && (
                                            <span className="italic">
                                                {' '}
                                                (nog niet vigerend)
                                            </span>
                                        )}
                                </span>
                                <span className="capitalize opacity-50">
                                    {object.Object_Type.replace('_', ' ')}
                                </span>
                            </div>
                        ),
                        value:
                            objectKey === 'Object_UUID'
                                ? object.UUID
                                : objectKey === 'Hierarchy_Code' ||
                                  objectKey === 'Werkingsgebied_Code' ||
                                  objectKey === 'Document_Code'
                                ? object.Object_Code
                                : object.Object_ID,
                        object,
                    })
                )

                callback(options)
                setOptionsState([...options, ...optionsState])
            })
            .catch(error => {
                console.error('Error while fetching suggestions:', error)
                callback([])
            })
    }

    const handleSuggestions = debounce(loadSuggestions, 500)

    const handleChange = (val?: Option | Option[] | null) => {
        setFieldValue(
            fieldName || objectKey,
            rest.isMulti && Array.isArray(val)
                ? val.map(e => e.value)
                : !Array.isArray(val) && val?.value
        )
        onChange?.(val)
    }

    return (
        <FormikSelect
            key={objectKey}
            name={objectKey}
            placeholder={placeholder}
            loadOptions={handleSuggestions}
            onChange={val => handleChange(val as Option)}
            noOptionsMessage={({ inputValue }) =>
                !inputValue
                    ? 'Start met typen om te zoeken'
                    : 'Geen objecten gevonden'
            }
            loadingMessage={() => 'Zoeken...'}
            isAsync
            cacheOptions
            isClearable
            components={{
                DropdownIndicator: () => (
                    <div className="mr-4">
                        <MagnifyingGlass
                            size={18}
                            className="text-pzh-blue-900"
                        />
                    </div>
                ),
            }}
            {...(rest.isMulti && {
                options: optionsState,
            })}
            {...rest}
        />
    )
}

export default DynamicObjectSearch
