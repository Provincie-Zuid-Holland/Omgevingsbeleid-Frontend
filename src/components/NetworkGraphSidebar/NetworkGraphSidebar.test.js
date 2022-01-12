import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraphSidebar from './NetworkGraphSidebar'

describe('NetworkGraphSidebar', () => {
    const setup = () => {
        const setGraphIsOpenMock = jest.fn(e => null)
        const setFiltersMock = jest.fn(e => null)

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
            setGraphIsOpen: setGraphIsOpenMock,
            setFilters: setFiltersMock,
        }

        render(
            <MemoryRouter>
                <NetworkGraphSidebar {...defaultProps} />
            </MemoryRouter>
        )
        return { setFiltersMock, setGraphIsOpenMock }
    }

    it('should render', () => {
        setup()
        expect(screen.queryByText('Vorige pagina')).toBeTruthy()
    })

    it('toggle a filter on click', () => {
        const { setFiltersMock } = setup()
        const filterItem = screen.queryByText('Beleidskeuzes')
        fireEvent.click(filterItem)
        expect(setFiltersMock).toBeCalledTimes(1)
    })

    it('closes the graph when clicked on previous page text', () => {
        const { setGraphIsOpenMock } = setup()
        const backToPage = screen.queryByText('Vorige pagina')
        fireEvent.click(backToPage)
        expect(setGraphIsOpenMock).toBeCalledTimes(1)
    })
})
