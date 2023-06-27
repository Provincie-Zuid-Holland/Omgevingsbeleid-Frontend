import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'

import { searchPost } from '@/api/fetchers'
import { SearchObject } from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'

type Option = {
    label: JSX.Element
    value: SearchObject
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
    /** Filter items by UUID or Object_ID */
    filter?: number | string | number[] | string[]
    /** Filter items by Object_Type */
    filterType?: ModelType
}

const DynamicObjectSearch = ({
    onChange,
    objectKey = 'uuid',
    placeholder = 'Zoek op titel van beleidskeuze, maatregel, etc.',
    label,
    filter,
    filterType,
    ...rest
}: DynamicObjectSearchProps) => {
    const { setFieldValue } = useFormikContext()

    const loadSuggestions = (
        query: string,
        callback: (options: Option[]) => void
    ) => {
        searchPost({ query })
            .then(data => {
                const filteredObject = !!filter
                    ? data.Objects.filter(object => {
                          if (Array.isArray(filter)) {
                              return objectKey === 'uuid'
                                  ? !!filterType
                                      ? object.Object_Type === filterType &&
                                        !(filter as string[]).includes(
                                            object.UUID
                                        )
                                      : !(filter as string[]).includes(
                                            object.UUID
                                        )
                                  : !!filterType
                                  ? object.Object_Type === filterType &&
                                    !(filter as number[]).includes(
                                        object.Object_ID
                                    )
                                  : !(filter as number[]).includes(
                                        object.Object_ID
                                    )
                          } else {
                              return objectKey === 'uuid'
                                  ? !!filterType
                                      ? object.Object_Type === filterType &&
                                        object.UUID !== filter
                                      : object.UUID !== filter
                                  : !!filterType
                                  ? object.Object_Type === filterType &&
                                    object.Object_ID !== filter
                                  : object.Object_ID !== filter
                          }
                      })
                    : data.Objects

                callback(
                    filteredObject.map(object => ({
                        label: (
                            <div className="flex justify-between">
                                <span>{object.Title}</span>
                                <span className="capitalize opacity-50">
                                    {object.Object_Type.replace('_', ' ')}
                                </span>
                            </div>
                        ),
                        value: object,
                    }))
                )
            })
            .catch(() => callback([]))
    }

    const handleSuggestions = debounce(loadSuggestions, 500)

    const key = objectKey === 'uuid' ? 'Object_UUID' : 'Object_ID'

    const handleChange = (val: SearchObject) => {
        setFieldValue(key, objectKey === 'uuid' ? val.UUID : val.Object_ID)
        return onChange(val)
    }

    return (
        <FormikSelect
            key={key}
            name={key}
            placeholder={placeholder}
            label={label}
            loadOptions={handleSuggestions}
            onChange={val => handleChange(val as SearchObject)}
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
