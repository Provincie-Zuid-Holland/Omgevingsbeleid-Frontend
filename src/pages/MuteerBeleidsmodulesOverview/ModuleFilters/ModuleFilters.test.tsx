import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ModuleFilters from './ModuleFilters'

describe('ModuleFilters', () => {
    const setFiltersMock = jest.fn()
    const defaultProps = {
        filters: {
            selectedStatus: 'Status',
            selectedType: 'Filter op beleid',
            statusFilters: ['Status', 'Ontwerp GS Concept', 'Ontwerp GS'],
            typeFilters: ['Filter op beleid', 'Beleidskeuze', 'Maatregel'],
        },
        setFilters: setFiltersMock,
    }

    it('should render', () => {
        render(<ModuleFilters {...defaultProps} />)
        const option = screen.getByText('Status')
        expect(option).toBeTruthy()
    })

    it('user can select a different type and status', () => {
        render(<ModuleFilters {...defaultProps} />)

        const selectType: HTMLSelectElement = screen.getByTestId(
            'modules-select-type'
        )
        const optionType: HTMLOptionElement = screen.getByRole('option', {
            name: 'Beleidskeuze',
        })

        userEvent.selectOptions(selectType, optionType)

        expect(setFiltersMock).toBeCalledTimes(1)
        expect(setFiltersMock).toHaveBeenCalledWith({
            newValue: 'Beleidskeuze',
            property: 'selectedType',
            type: 'changeValue',
        })

        const selectStatus: HTMLSelectElement = screen.getByTestId(
            'modules-select-status'
        )
        const optionStatus: HTMLOptionElement = screen.getByRole('option', {
            name: 'Ontwerp GS Concept',
        })

        userEvent.selectOptions(selectStatus, optionStatus)

        expect(setFiltersMock).toBeCalledTimes(2)
        expect(setFiltersMock).toHaveBeenCalledWith({
            newValue: 'Ontwerp GS Concept',
            property: 'selectedStatus',
            type: 'changeValue',
        })

        // const options = screen.getAllByRole('option', {label: }) as HTMLOptionElement[]
    })
})
