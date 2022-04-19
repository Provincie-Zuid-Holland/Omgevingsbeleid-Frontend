import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraphSidebar from './NetworkGraphSidebar'

describe('NetworkGraphSidebar', () => {
    const setup = () => {
        const setFiltersMock = jest.fn(() => null)

        const defaultProps = {
            filters: {
                beleidskeuzes: true,
                ambities: true,
                beleidsdoelen: true,
                beleidsprestaties: true,
                beleidsregels: false,
                maatregelen: false,
                themas: false,
                verordeningen: false,
            },
            setFilters: setFiltersMock,
        }

        render(
            <MemoryRouter>
                <NetworkGraphSidebar {...defaultProps} />
            </MemoryRouter>
        )
        return { setFiltersMock }
    }

    it('should render', () => {
        setup()
        expect(screen.queryByText('Vorige pagina')).toBeTruthy()
    })

    it('toggle a filter on click', () => {
        const { setFiltersMock } = setup()
        const filterItem = screen.queryByText('Beleidskeuzes') as Element

        fireEvent.click(filterItem)
        expect(setFiltersMock).toBeCalledTimes(1)
    })
})
