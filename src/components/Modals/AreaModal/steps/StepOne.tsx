import { useFormikContext } from 'formik'
import debounce from 'lodash.debounce'
import { useMemo, useState } from 'react'

import {
    FieldInput,
    FieldLabel,
    FormikRadioGroup,
    Text,
} from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'

import AreaPreview from '@/components/AreaPreview'
import { LoaderSpinner } from '@/components/Loader'

import { AreaProps } from '../AreaModal'
import { StepProps } from './types'

export const StepOne = ({ data, isLoading }: StepProps) => {
    const { values, setFieldValue } = useFormikContext<AreaProps>()
    const [query, setQuery] = useState('')

    /**
     * Format data to field options
     */
    const options = useMemo(
        () =>
            data &&
            Object.keys(data).map(item => {
                const amount = data[item].length
                const firstItem = data[item][0]
                const label = `${firstItem.Title} (${amount} ${
                    amount === 1 ? 'versie' : 'versies'
                })`
                const value = firstItem.ID.toString()

                return { label, value }
            }),
        [data]
    )

    /**
     * Filter options based on query
     */
    const filteredOptions = useMemo(
        () =>
            options?.filter(
                option =>
                    !!option.label
                        .toLowerCase()
                        .includes(query.toLocaleLowerCase())
            ),
        [query, options]
    )

    const handleChange = debounce(e => setQuery(e.target.value), 500)

    /**
     * Find selected area by ID
     */
    const selectedArea = useMemo(() => {
        if (!data) return

        const selected = Object.keys(data).find(item =>
            data[item].some(
                item => values.area && item.ID === parseInt(values.area)
            )
        )

        if (!selected) return

        setFieldValue('version', data[selected][0].UUID)

        return data[selected][0]
    }, [data, values.area, setFieldValue])

    return (
        <div>
            <Text className="mb-6">
                Selecteer een werkingsgebied, in de volgende stap kan je een
                versie kiezen.
            </Text>

            <div className="grid grid-cols-9 gap-4">
                <div className="col-span-5">
                    <FieldLabel name="area" label="Werkingsgebieden" />

                    <div className="mb-2">
                        <FieldInput
                            name="search"
                            placeholder="Zoek een werkingsgebied op naam of de naam van een versie"
                            icon={MagnifyingGlass}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="h-[460px] overflow-y-auto rounded border border-pzh-gray-200 p-4">
                        {isLoading ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <LoaderSpinner />
                            </div>
                        ) : (
                            <FormikRadioGroup
                                name="area"
                                options={filteredOptions || []}
                                required
                                optimized={false}
                            />
                        )}
                    </div>
                </div>
                <div className="col-span-4 flex flex-col">
                    <Text bold className="mb-2">
                        Voorbeeld
                    </Text>

                    <div className="flex flex-1">
                        <AreaPreview area={selectedArea} />
                    </div>
                </div>
            </div>
        </div>
    )
}
