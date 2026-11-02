import { useMemo } from 'react'

import { FormikSelect, Heading, Text } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'

import { useFormikContext } from 'formik'

import { ReadRelation } from '@/api/fetchers.schemas'
import { Option } from '@/components/DynamicObject/DynamicObjectSearch'
import { ModelReturnTypeBasicUnion } from '@/config/objects/types'

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
        () => connections?.map(connection => connection.object_id),
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
        useGetValid<{
            results: ModelReturnTypeBasicUnion[]
        }>?.(
            {
                limit: 500,
                sort_column: 'title',
                sort_order: 'ASC',
            },
            {
                query: {
                    select: (data: {
                        results: ModelReturnTypeBasicUnion[]
                    }) => {
                        if (atemporal || !selected?.length) return data

                        return {
                            ...data,
                            results: data.results.filter(object =>
                                Array.isArray(selected)
                                    ? !selected.includes(
                                          Number(object.object_id)
                                      )
                                    : object.object_id !== selected
                            ),
                        }
                    },
                },
            }
        ) || {}

    const options = useMemo(
        () =>
            items?.results.map(({ title: _title, object_id }) => ({
                label: _title,
                value: object_id,
            })),
        [items]
    )

    return (
        <>
            <Heading level="2" size="xl" className="mb-2">
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
                    name="object_id"
                    options={options}
                    defaultValue={
                        values.title &&
                        values.object_id && {
                            label: values.title,
                            value: values.object_id,
                        }
                    }
                    onChange={val =>
                        setFieldValue('title', (val as Option)?.label)
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
