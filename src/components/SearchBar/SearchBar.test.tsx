import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import SearchBar from './SearchBar'

vi.mock('react-router-dom', async () => {
    const actual = (await vi.importActual('react-router-dom')) as any

    return {
        ...actual,
        useLocation: () => ({
            pathname: '/zoekresultaten',
            search: '?query=',
        }),
    }
})

describe('SearchBar', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <BrowserRouter>
                <SearchBar {...props} />
            </BrowserRouter>
        )
        const searchBar = screen.getByPlaceholderText(
            'Zoek binnen het beleid van de provincie Zuid-Holland'
        ) as HTMLInputElement
        return { searchBar }
    }

    it('Component renders', () => {
        const { searchBar } = setup()
        expect(searchBar).toBeTruthy()
    })

    it('User can search', async () => {
        const { searchBar } = setup()

        // Assertion onChange
        const searchQuery = 'Test'
        fireEvent.change(searchBar, { target: { value: searchQuery } })
        expect(searchBar.value).toBe(searchQuery)

        // Check if url changes when user hits enter
        fireEvent.keyDown(searchBar, {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
        })
        expect(location.pathname).toBe(`/zoekresultaten`)
        expect(location.search).toBe(`?query=${searchQuery}`)
    })
})
