import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { cloneElement, useState } from 'react'

import FormFieldGeldigheid from './FormFieldGeldigheid'

const ParentWrapper = ({ children, initEmpty }) => {
    const [fieldValue, setFieldValue] = useState(
        initEmpty ? null : '2020-12-12'
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

describe('FormFieldGeldigheid', () => {
    const setup = (props = {}) => {
        const { initEmpty, disabled, fieldLabel, property } = props

        render(
            <ParentWrapper initEmpty={initEmpty}>
                <FormFieldGeldigheid
                    disabled={disabled}
                    hideToggleUitwerkingstrede={false}
                    dataObjectProperty={property ? property : 'Eind_Geldigheid'}
                    fieldLabel="Label"
                    titleSingular="Titel"
                />
            </ParentWrapper>
        )

        const testid = !property
            ? `form-field-titel-eind_geldigheid`
            : `form-field-titel-${property.toLowerCase()}`

        const input = screen.getByTestId(testid)
        return { fieldLabel, input }
    }

    it('should render with Eind_Geldigheid', () => {
        const { input } = setup({ property: 'Eind_Geldigheid' })
        expect(input).toBeInTheDocument()
    })

    it('should render with Begin_Geldigheid', () => {
        const { input } = setup({ property: 'Begin_Geldigheid' })
        expect(input).toBeInTheDocument()
    })

    it('should have the provided value as value', () => {
        const { input } = setup()
        expect(input).toHaveValue('2020-12-12')
    })

    it('should be editable by the user', () => {
        const { input } = setup()
        fireEvent.change(input, { target: { value: '2021-10-10' } })
        expect(input).toHaveValue('2021-10-10')
    })

    it('user can toggle uitwerkingtreding date', () => {
        const { input } = setup()
        const toggle = screen.getByText('Verberg veld voor uitwerkingtreding')
        expect(toggle).toBeInTheDocument()
        expect(input).toBeInTheDocument()
        fireEvent.click(toggle)
        expect(input).not.toBeInTheDocument()
    })
})
