import { render, screen, fireEvent } from '@testing-library/react'

import ModuleFilters from './ModuleFilters'

describe('ModuleFilters', () => {
    const setFiltersMock = jest.fn()
    const defaultProps = {
        filters: {
            typeFilters: ['Beleidstuk', 'Type one', 'Type two'],
        },
        setFilters: setFiltersMock,
    }

    it('should render', () => {
        render(<ModuleFilters {...defaultProps} />)
        const option = screen.getByText('Beleidstuk')
        expect(option).toBeTruthy()
    })

    it('user can select a different type', () => {
        render(<ModuleFilters {...defaultProps} />)

        const select = screen.getByRole('combobox')
        const options = screen.getAllByRole('option') as HTMLOptionElement[]

        expect(options[0].selected).toBeTruthy()
        expect(options[1].selected).toBeFalsy()
        expect(options[2].selected).toBeFalsy()

        fireEvent.change(select, { target: { value: 'Type one' } })

        expect(options[0].selected).toBeFalsy()
        expect(options[1].selected).toBeTruthy()
        expect(options[2].selected).toBeFalsy()
    })
})
