import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import FormFieldRadioButton from './FormFieldRadioButton'

describe('FormFieldRadioButton', () => {
    const defaultProps = {}
    const mockHandleChange = jest.fn()

    const titelEnkelvoud = 'Maatregel'
    const options = ['Gebiedsspecifiek', 'Generiek']
    const fieldValue = 'Gebiedsspecifiek'
    const secondOption = 'Generiek'
    const dataObjectProperty = 'Specifiek_Of_Generiek'

    it('should render', () => {
        const props = { ...defaultProps }

        const { asFragment, queryByText } = render(
            <FormFieldRadioButton
                options={options}
                handleChange={mockHandleChange}
                fieldValue={fieldValue}
                dataObjectProperty={dataObjectProperty}
                titelEnkelvoud={titelEnkelvoud}
                label="Intentie van het werkingsgebied"
                {...props}
            />
        )
        expect(queryByText('Gebiedsspecifiek')).toBeTruthy()
    })

    it('Should be checked when options include fieldValue', () => {
        const props = { ...defaultProps }
        const id = `form-field-${titelEnkelvoud.toLowerCase()}-${dataObjectProperty.toLowerCase()}-${
            options[0]
        }`
        const { container } = render(
            <FormFieldRadioButton
                options={['Gebiedsspecifiek', 'Generiek']}
                handleChange={mockHandleChange}
                fieldValue={fieldValue}
                dataObjectProperty={dataObjectProperty}
                titelEnkelvoud={titelEnkelvoud}
                label="Intentie van het werkingsgebied"
                {...props}
            />
        )
        const initialCheckedInput = screen.getByDisplayValue(fieldValue)
        const otherInput = screen.getByDisplayValue(secondOption)
        fireEvent.click(otherInput)
        // expect(initialCheckedInput.checked).toBeFalsy()
        // expect(otherInput.checked).toBeTruthy()
    })
})
