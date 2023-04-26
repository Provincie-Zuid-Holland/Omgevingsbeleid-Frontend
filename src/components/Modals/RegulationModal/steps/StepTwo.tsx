import { FormikSelect, Text } from '@pzh-ui/components'
import { MagnifyingGlass } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { StepProps } from './types'

export const StepTwo = ({ title, model, items, isLoading }: StepProps) => {
    const options = useMemo(
        () => items?.map(item => ({ label: item.Title, value: item.UUID })),
        [items]
    )

    return (
        <>
            <Text className="mb-4">
                Selecteer de nationale belangen en wettelijke taken waarmee je
                een koppeling wilt maken vanuit {model.defaults.singular}:{' '}
                <span className="font-bold">{title}</span>
            </Text>
            <FormikSelect
                optimized={false}
                name="items"
                options={options}
                placeholder="Zoek in de nationale belangen en wettelijke taken"
                label="Nationale belangen en Wettelijke taken"
                isMulti
                menuIsOpen
                isSearchable
                isClearable={false}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                controlShouldRenderValue={false}
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
            />
        </>
    )
}
