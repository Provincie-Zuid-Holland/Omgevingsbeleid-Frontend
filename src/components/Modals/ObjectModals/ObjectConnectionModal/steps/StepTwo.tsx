import { FormikSelect, Text } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useFormikContext } from 'formik'
import { useMemo } from 'react'

import { ReadRelation } from '@/api/fetchers.schemas'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'

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

    const { defaults, fetchers } = connectionModel || {}
    const {
        atemporal,
        pluralCapitalize,
        plural,
        prefixSingular,
        singular,
        singularReadable,
    } = defaults || {}
    const { useGetValid } = fetchers || {}

    const { data: items, isLoading } =
        useGetValid?.(
            { limit: 200 },
            {
                query: { enabled: atemporal },
            }
        ) || {}

    const options = useMemo(
        () =>
            items?.results.map(({ Title, Object_ID }) => ({
                label: Title,
                value: { Object_ID, Title },
            })),
        [items]
    )

    const selected = useMemo(
        () => connections?.map(connection => connection.Object_ID),
        [connections]
    )

    return (
        <>
            <Text className="mb-4">
                Selecteer {prefixSingular} {singularReadable} waarmee je een
                koppeling wilt maken vanuit {model.defaults.singularReadable}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            {atemporal ? (
                <FormikSelect
                    optimized={false}
                    name="items"
                    options={options}
                    placeholder={`Zoek in de ${plural?.replaceAll('-', ' ')}`}
                    label={pluralCapitalize}
                    isMulti
                    menuIsOpen
                    isSearchable
                    isClearable={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    controlShouldRenderValue={false}
                    noOptionsMessage={() =>
                        `Er zijn geen ${plural?.replaceAll('-', ' ')} gevonden`
                    }
                    isLoading={isLoading}
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
                    styles={{
                        menu: base => ({
                            ...base,
                            position: 'relative',
                            zIndex: 9999,
                            marginTop: 2,
                            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                        }),
                    }}
                    blurInputOnSelect
                />
            ) : (
                <DynamicObjectSearch
                    onChange={object => setFieldValue('Title', object?.Title)}
                    objectKey="id"
                    filter={selected}
                    filterType={singular && [singular]}
                    placeholder={`Zoek in de ${plural}`}
                    label={pluralCapitalize}
                    defaultValue={
                        values.Title &&
                        values.Object_ID && {
                            label: values.Title,
                            value: values.Object_ID,
                        }
                    }
                    styles={{
                        menu: base => ({
                            ...base,
                            position: 'relative',
                            zIndex: 9999,
                            marginTop: 2,
                            boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                        }),
                    }}
                />
            )}
        </>
    )
}
