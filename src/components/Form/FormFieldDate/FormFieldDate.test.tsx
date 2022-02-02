import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import FormFieldDate from './FormFieldDate'

describe('FormFieldDate', () => {
    const defaultProps = {
        fieldValue: '1753-01-01',
        disabled: false,
        dataObjectProperty: 'begin_geldigheid',
        fieldLabel: 'Test Datum',
        pValue: 'Test Omschrijving',
        titleSingular: 'Begin Geldigheid',
        handleChange: jest.fn(),
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(<FormFieldDate {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test Datum')
        expect(element).toBeTruthy()
    })
})
