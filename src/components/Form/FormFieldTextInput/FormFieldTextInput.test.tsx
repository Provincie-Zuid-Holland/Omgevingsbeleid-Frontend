import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { cloneElement, useState } from 'react'

import FormFieldTextInput from './FormFieldTextInput'

const ParentWrapper = ({
    children,
    initEmpty,
}: {
    children: any
    initEmpty?: boolean
}) => {
    const [fieldValue, setFieldValue] = useState(
        initEmpty ? null : 'Test Value'
    )

    const handleChange = jest.fn(e => {
        setFieldValue(e.target.value)
    })

    return (
        <div>
            {cloneElement(children, {
                fieldValue: fieldValue,
                handleChange: handleChange,
            })}
        </div>
    )
}

describe('FormFieldTextInput', () => {
    const setup = (initEmpty?: boolean, disabled?: boolean) => {
        const fieldLabel = 'Test title'

        render(
            <ParentWrapper initEmpty={initEmpty}>
                <FormFieldTextInput
                    disabled={disabled}
                    dataObjectProperty="property"
                    fieldLabel={fieldLabel}
                    pValue="Formuleer in enkele woorden de titel van deze ambitie."
                    titleSingular={'Singular'}
                />
            </ParentWrapper>
        )

        const testid = `form-field-singular-property`
        const input = screen.getByTestId(testid) as HTMLInputElement

        return { fieldLabel, input }
    }

    it('should render', () => {
        setup()
        const emailLabel = screen.getByText('Test title')
        expect(emailLabel).toBeTruthy()
    })

    it('should contain a prefilled in value if provided', () => {
        const { input } = setup()
        expect(input).toHaveValue('Test Value')
    })

    it('should show a placeholder when there is no value', () => {
        const { fieldLabel, input } = setup(true)
        expect(input.placeholder).toBe(fieldLabel)
    })

    it('should change when a user types', () => {
        const { input } = setup(true)
        fireEvent.change(input, { target: { value: 'new test value' } })
        expect(input).toHaveValue('new test value')

        fireEvent.change(input, { target: { value: 'edited test value' } })
        expect(input).toHaveValue('edited test value')
    })

    it('element should be disabled when the disabled prop is true', () => {
        const { input } = setup(true, true)
        expect(input).toBeDisabled()
    })

    it('should display a message if the input is disabled', () => {
        setup(true, true)
        const disabledParagraph = screen.getByText(
            'Formuleer in enkele woorden de titel van deze ambitie. (Kan niet zonder besluitvorming worden gewijzigd)'
        )
        expect(disabledParagraph).toBeTruthy()
    })

    it('should display a normal paragraph if the input is not disabled', () => {
        setup(true, false)
        const disabledParagraph = screen.getByText(
            'Formuleer in enkele woorden de titel van deze ambitie.'
        )
        expect(disabledParagraph).toBeTruthy()
    })
})
