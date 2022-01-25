import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import { cloneElement, useState } from 'react'

import FormFieldTextArea from './FormFieldTextArea'

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

describe('FormFieldTextArea', () => {
    const setup = (
        initEmpty?: boolean,
        disabled?: boolean,
        emptyPlaceholder?: boolean
    ) => {
        const fieldLabel = 'Label'
        const placeholderTekst = !emptyPlaceholder ? 'Test placeholder' : ''

        render(
            <ParentWrapper initEmpty={initEmpty}>
                <FormFieldTextArea
                    fieldLabel={fieldLabel}
                    pValue="Test pValue"
                    disabled={disabled}
                    anchorText="Test anchorText"
                    anchorLink="Test anchorLink"
                    titleSingular="Title Singular"
                    dataObjectProperty="property"
                    placeholderTekst={placeholderTekst}
                />
            </ParentWrapper>
        )
        const testid = `form-field-title singular-property`
        const textarea = screen.getByTestId(testid) as HTMLTextAreaElement

        return { fieldLabel, placeholderTekst, textarea }
    }

    it('should render', () => {
        setup()
        expect(screen.getByText('Test Value')).toBeTruthy()
    })

    it('should contain a prefilled in value if provided', () => {
        const { textarea } = setup()
        expect(textarea).toHaveValue('Test Value')
    })

    it('should show a placeholder when there is no value', () => {
        const { placeholderTekst, textarea } = setup(true)
        expect(textarea.placeholder).toBe(placeholderTekst)
    })

    it('should change when a user types', () => {
        const { textarea } = setup(true)
        fireEvent.change(textarea, { target: { value: 'new test value' } })
        expect(textarea).toHaveValue('new test value')

        fireEvent.change(textarea, { target: { value: 'edited test value' } })
        expect(textarea).toHaveValue('edited test value')
    })

    it('element should be disabled when the disabled prop is true', () => {
        const { textarea } = setup(true, true)
        expect(textarea).toBeDisabled()
    })

    it('should display a normal paragraph if the textarea is not disabled', () => {
        setup(true, false)
        const disabledParagraph = screen.getByText('Test pValue')
        expect(disabledParagraph).toBeTruthy()
    })

    it('should display a default placeholder, when placeholderTekst is empty', () => {
        const { fieldLabel, textarea } = setup(true, false, true)
        expect(textarea.placeholder).toBe(
            `Typ hier uw ${fieldLabel.toLowerCase()}`
        )
    })
})
