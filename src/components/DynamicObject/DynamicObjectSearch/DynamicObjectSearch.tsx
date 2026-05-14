import { FieldSelectProps, FormikSelect } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useState } from 'react'

import { searchGetMssqlSearch, searchGetMssqlValidSearch } from '@/api/fetchers'
import {
    SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic,
    ValidSearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic,
} from '@/api/fetchers.schemas'
import { ModelType } from '@/config/objects/types'
import { useParams } from 'react-router-dom'

export type Option = {
    label: React.JSX.Element
    value?: string | number
    object?: SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic
}

export interface DynamicObjectSearchProps
    extends Omit<FieldSelectProps, 'onChange' | 'name'> {
    /** Gets called when selecting an option */
    onChange?: (object?: Option | Option[] | null) => void
    /** Key of model */
    objectKey?: 'Object_UUID' | 'Object_ID' | 'Object_Code'
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
    /** Filter on Module ID */
    filterOnModule?: boolean
    /** Status of object */
    status?: 'valid' | 'all'
    /** Initial options  */
    initialOptions?: Option[]
}

const DynamicObjectSearch = ({
    onChange,
    objectKey = 'Object_UUID',
    fieldName,
    placeholder = 'Zoek op titel van beleidskeuze, maatregel, etc.',
    filter,
    filterType,
    filterOnModule,
    status = 'valid',
    initialOptions = [],
    ...rest
}: DynamicObjectSearchProps) => {
    const { moduleId } = useParams()

    const { setFieldValue } = useFormikContext()

    const [optionsState, setOptionsState] = useState<Option[]>(initialOptions)

    const searchEndpoint =
        status === 'valid' ? searchGetMssqlValidSearch : searchGetMssqlSearch

    const loadSuggestions = (
        query: string,
        callback: (options: Option[]) => void
    ) => {
        searchEndpoint(
            { Object_Types: filterType, Like: true },
            { query, limit: 50 }
        )
            .then(data => {
                let filteredObject = data.results

                if (filter) {
                    filteredObject = data.results.filter(object =>
                        Array.isArray(filter)
                            ? objectKey === 'Object_UUID'
                                ? !(filter as string[]).includes(
                                      object.Model.UUID || ''
                                  )
                                : !(filter as number[]).includes(
                                      object.Model.Object_ID || 0
                                  )
                            : objectKey === 'Object_UUID'
                              ? object.Model.UUID !== filter
                              : object.Model.Object_ID !== filter
                    )
                }

                if (filterOnModule && !!moduleId) {
                    filteredObject = filteredObject.filter(object => {
                        if (
                            'Module_ID' in object &&
                            (object.Module_ID === null ||
                                object.Module_ID === parseInt(moduleId))
                        ) {
                            return true
                        }

                        return false
                    })
                }

                const options = filteredObject.map(
                    (
                        object:
                            | SearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic
                            | ValidSearchObjectUnionAmbitieBasicBeleidsdoelBasicBeleidskeuzeBasicBeleidsregelBasicDocumentBasicGebiedsprogrammaBasicMaatregelBasicNationaalBelangBasicGebiedengroepBasicGebiedBasicGebiedsaanwijzingBasicProgrammaAlgemeenBasicVerplichtProgrammaBasicVisieAlgemeenBasicWerkingsgebiedBasicWettelijkeTaakBasic
                    ) => ({
                        label: (
                            <div className="flex justify-between gap-4">
                                <span>
                                    {object.Model.Title}

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
                                ? object.Model.UUID
                                : objectKey === 'Object_Code'
                                  ? object.Model.Code
                                  : object.Model.Object_ID,
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
