import { render, screen, fireEvent } from '@testing-library/react'
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
    const defaultProps = {
        fieldLabel: 'Label',
        pValue: 'Test pValue',
        disabled: false,
        anchorText: 'Test anchorText',
        anchorLink: 'Test anchorLink',
        titleSingular: 'Title Singular',
        dataObjectProperty: 'property',
        placeholderTekst: 'Test placeholder',
    }

    const setup = (initEmpty?: boolean, customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <ParentWrapper initEmpty={initEmpty}>
                <FormFieldTextArea {...props} />
            </ParentWrapper>
        )
        const testid = `form-field-title singular-property`
        const textarea = screen.getByTestId(testid) as HTMLTextAreaElement

        return { textarea }
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
        const { textarea } = setup(true)
        expect(textarea.placeholder).toBe('Test placeholder')
    })

    it('should change when a user types', () => {
        const { textarea } = setup(true)
        fireEvent.change(textarea, { target: { value: 'new test value' } })
        expect(textarea).toHaveValue('new test value')

        fireEvent.change(textarea, { target: { value: 'edited test value' } })
        expect(textarea).toHaveValue('edited test value')
    })

    it('element should be disabled when the disabled prop is true', () => {
        const { textarea } = setup(true, { disabled: true })
        expect(textarea).toBeDisabled()
    })

    it('should display a normal paragraph if the textarea is not disabled', () => {
        setup(true)
        const disabledParagraph = screen.getByText('Test pValue')
        expect(disabledParagraph).toBeTruthy()
    })

    it('should display a default placeholder, when placeholderTekst is empty', () => {
        const { textarea } = setup(true, { placeholderTekst: '' })
        expect(textarea.placeholder).toBe(`Typ hier uw label`)
    })
})
