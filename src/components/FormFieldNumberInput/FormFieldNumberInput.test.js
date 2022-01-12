import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { cloneElement, useState } from 'react'

import FormFieldNumberInput from './FormFieldNumberInput'

const ParentWrapper = ({ children, initEmpty }) => {
    const [fieldValue, setFieldValue] = useState(initEmpty ? null : '100')

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

describe('FormFieldNumberInput', () => {
    const setup = () => {
        render(
            <ParentWrapper>
                <FormFieldNumberInput
                    dataObjectProperty={'numberProperty'}
                    pValue={'Description'}
                    titleSingular={'Singular'}
                    fieldLabel={'Label'}
                />
            </ParentWrapper>
        )

        const input = screen.getByTestId(`form-field-singular-numberproperty`)
        return { input }
    }
    it('should render', () => {
        setup()
        const label = screen.getByText('Label')
        expect(label).toBeTruthy()

        const description = screen.getByText('Description')
        expect(description).toBeTruthy()
    })

    it('contains the provided value', () => {
        const { input } = setup()
        expect(input).toHaveValue(100)
    })

    it('changes the value when a user types in it', () => {
        const { input } = setup()
        fireEvent.change(input, { target: { value: 200 } })
        expect(input).toHaveValue(200)
    })
})
