import { render, screen } from '@testing-library/react'
import { useState, cloneElement } from 'react'
import '@testing-library/jest-dom'

import FormFieldDate from './FormFieldDate'

const ParentWrapper = ({
    children,
    initEmpty,
}: {
    children: any
    initEmpty?: boolean
}) => {
    const [fieldValue, setFieldValue] = useState(
        initEmpty ? null : '1753-01-01'
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

describe('FormFieldDate', () => {
    const defaultProps = {
        disabled: false,
        dataObjectProperty: 'begin_geldigheid',
        fieldLabel: 'Test Datum',
        pValue: 'Test Omschrijving',
        titleSingular: 'Begin Geldigheid',
    }

    const setup = (initEmpty?: boolean, customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <ParentWrapper initEmpty={initEmpty}>
                <FormFieldDate {...props} />
            </ParentWrapper>
        )

        const testid = `form-field-begin geldigheid-begin_geldigheid`
        const input = screen.getByTestId(testid) as HTMLInputElement

        return { input }
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test Datum')
        expect(element).toBeTruthy()
    })

    it('element should be disabled when the disabled prop is true', () => {
        const { input } = setup(true, { disabled: true })
        expect(input).toBeDisabled()
    })
})
