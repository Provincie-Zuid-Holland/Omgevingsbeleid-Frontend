import {
    render,
    waitForElementToBeRemoved,
    screen,
    fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import FormFieldSelectBeleidskeuze from './FormFieldSelectBeleidskeuze'

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

describe('FormFieldSelectBeleidskeuze', () => {
    const handleChangeMock = jest.fn()
    const defaultProps = {
        filter: '0000-0001',
        handleChange: handleChangeMock,
        fieldValue: 'EE9DB572-31F7-4093-936B-97A23FAB1A95',
        fieldLabel: 'Naar beleidskeuze',
        dataObjectProperty: 'Naar_Beleidskeuze',
        titleSingular: 'titleSingular',
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(<FormFieldSelectBeleidskeuze {...props} />)
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Naar beleidskeuze')
        expect(element).toBeTruthy()
    })

    it('User can select an option', async () => {
        setup()

        await waitForElementToBeRemoved(() => screen.queryByRole('img'))

        const select = screen.getByTestId('select')
        expect(select).toBeInTheDocument()

        fireEvent.change(select, {
            target: { value: '30D160AC-1235-4D1F-A3B0-184EAC3BD9F4' },
        })
        expect(select.value).toBe('30D160AC-1235-4D1F-A3B0-184EAC3BD9F4')

        fireEvent.change(select, {
            target: { value: 'EE9DB572-31F7-4093-936B-97A23FAB1A95' },
        })
        expect(select.value).toBe('EE9DB572-31F7-4093-936B-97A23FAB1A95')
    })
})
