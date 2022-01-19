import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import FormFieldTextArea from './FormFieldTextArea'

describe('FormFieldTextArea', () => {
    const setup = disabled => {
        const fieldLabel = 'Label'

        render(
            <FormFieldTextArea
                disabled={disabled}
                dataObjectProperty="property"
                placeholder="Placeholder"
                initialValue="InitialValue"
                fieldValue="FieldValue"
                fieldLabel={fieldLabel}
                titleSingular="Title Singular"
            />
        )
        const testid = `form-field-title singular-property`
        const textarea = screen.getByTestId(testid)

        return { textarea, fieldLabel }
    }

    it('should render', () => {
        setup()
        expect(screen.getByText('FieldValue')).toBeTruthy()
    })

    it('should show a placeholder when there is no value', () => {
        const { textarea, fieldLabel } = setup(true)
        expect(textarea.placeholder).toBe(
            `Typ hier uw ${fieldLabel.toLowerCase()}`
        )
    })

    it('element should be disabled when the disabled prop is true', () => {
        const { textarea } = setup(true)
        expect(textarea).toBeDisabled()
    })
})
