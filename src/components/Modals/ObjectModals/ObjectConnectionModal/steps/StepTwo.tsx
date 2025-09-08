import { FormikSelect, Heading, Text } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { ReadRelation } from '@/api/fetchers.schemas'

import { Option } from '@/components/DynamicObject/DynamicObjectSearch'
import { StepProps } from './types'

export const StepTwo = ({
    title,
    connectionModel,
    model,
    connections,
}: StepProps) => {
    const { values, setFieldValue } = useFormikContext<
        ReadRelation & { items?: ReadRelation[] }
    >()

    const selected = useMemo(
        () => connections?.map(connection => connection.Object_ID),
        [connections]
    )

    const { defaults, fetchers } = connectionModel || {}
    const {
        atemporal,
        pluralReadable,
        prefixSingular,
        singularReadable,
        singularCapitalize,
    } = defaults || {}
    const { useGetValid } = fetchers || {}

    const { data: items, isLoading } =
        useGetValid?.(
            {
                limit: 500,
                sort_column: 'Title',
                sort_order: 'ASC',
            },
            {
                query: {
                    select: data => {
                        if (atemporal || !selected?.length) return data

                        return {
                            ...data,
                            results: data.results.filter(object =>
                                Array.isArray(selected)
                                    ? !selected.includes(
                                          Number(object.Object_ID)
                                      )
                                    : object.Object_ID !== selected
                            ),
                        }
                    },
                },
            }
        ) || {}

    const options = useMemo(
        () =>
            items?.results.map(({ Title, Object_ID }) => ({
                label: Title,
                value: Object_ID,
            })),
        [items]
    )

    return (
        <>
            <Heading level="2" className="mb-2">
                {singularCapitalize} koppelen
            </Heading>

            <Text className="mb-4">
                Selecteer {prefixSingular} {singularReadable} waarmee je een
                koppeling wilt maken vanuit {model.defaults.singularReadable}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            {atemporal ? (
                <FormikSelect
                    key={isLoading?.toString()}
                    name="items"
                    options={options}
                    placeholder={`Zoek in de ${pluralReadable}`}
                    label={`Selecteer een ${singularReadable}`}
                    isMulti
                    menuIsOpen
                    isSearchable
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    controlShouldRenderValue={false}
                    noOptionsMessage={() =>
                        `Er zijn geen ${pluralReadable} gevonden`
                    }
                    isLoading={isLoading}
                    required
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
                    styles={{
                        menu: base => ({
                            ...base,
                            position: 'relative',
                            zIndex: 9999,
                            marginTop: 4,
                            boxShadow: 'none',
                        }),
                    }}
                    blurInputOnSelect
                />
            ) : (
                <FormikSelect
                    key={isLoading?.toString()}
                    name="Object_ID"
                    options={options}
                    defaultValue={
                        values.Title &&
                        values.Object_ID && {
                            label: values.Title,
                            value: values.Object_ID,
                        }
                    }
                    onChange={val =>
                        setFieldValue('Title', (val as Option)?.label)
                    }
                    placeholder={`Zoek in de ${pluralReadable}`}
                    label={`Selecteer een ${singularReadable}`}
                    defaultMenuIsOpen
                    isSearchable
                    isClearable={false}
                    noOptionsMessage={() =>
                        `Er zijn geen ${pluralReadable} gevonden`
                    }
                    isLoading={isLoading}
                    required
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
                    styles={{
                        menu: base => ({
                            ...base,
                            position: 'relative',
                            zIndex: 9999,
                            marginTop: 4,
                            boxShadow: 'none',
                        }),
                    }}
                    blurInputOnSelect
                />
            )}
        </>
    )
}
