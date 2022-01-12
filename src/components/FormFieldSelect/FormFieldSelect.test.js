import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import FormFieldSelect from './FormFieldSelect'

describe('FormFieldSelect', () => {
    const handleChangeMock = jest.fn()
    const defaultProps = {
        handleChange: handleChangeMock,
        titleSingular: 'titleSingular',
        fieldValue: 'value2',
        selectArray: ['value1', 'value2', 'value3'],
        fieldLabel: 'Type',
        dataObjectProperty: 'Type',
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<FormFieldSelect {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Type')
        expect(element).toBeTruthy()
    })

    it('User can select a value', () => {
        setup({ fieldValue: null })
        const select = screen.getByRole('combobox')
        expect(select).toBeTruthy()
        expect(select).toHaveValue('')
        fireEvent.change(select, { target: { value: 'value1' } })
        expect(handleChangeMock).toHaveBeenCalledTimes(1)
    })
})
