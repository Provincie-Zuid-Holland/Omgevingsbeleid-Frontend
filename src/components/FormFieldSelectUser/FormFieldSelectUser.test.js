import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { users } from './../../mocks/data/users'
import FormFieldSelectUser from './FormFieldSelectUser'

// https://polvara.me/posts/testing-a-custom-select-with-react-testing-library
jest.mock('react-select', () => ({ options, value, onChange }) => {
    function handleChange(event) {
        const option = options.find(
            option => option.value === event.currentTarget.value
        )
        onChange(option)
    }

    return (
        <select data-testid="select" value={value} onChange={handleChange}>
            {options.map(({ label, value }) => (
                <option key={value} value={value}>
                    {label}
                </option>
            ))}
        </select>
    )
})

describe('FormFieldSelectUser', () => {
    const handleChangeMock = jest.fn()
    const defaultProps = {
        disabled: false,
        editStatus: false,
        halfWidth: true,
        handleChange: handleChangeMock,
        fieldValue: '0000',
        dataObjectProperty: 'Opdrachtgever',
        gebruikersLijst: users,
        filter: 'Ambtelijk opdrachtgever',
        pValue: 'Ambtelijk opdrachtgever',
        titleSingular: 'titleSingular',
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<FormFieldSelectUser {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Ambtelijk opdrachtgever')
        expect(element).toBeTruthy()
    })

    it('User can select an option', () => {
        setup()

        const select = screen.getByTestId('select')
        expect(select).toBeInTheDocument()

        fireEvent.change(select, {
            target: { value: '79A74958-DB05-464C-BD19-000000000000' },
        })
        expect(select.value).toBe('79A74958-DB05-464C-BD19-000000000000')

        fireEvent.change(select, {
            target: { value: '79A74958-DB05-464C-EA18-000000000000' },
        })
        expect(select.value).toBe('79A74958-DB05-464C-EA18-000000000000')
    })
})
