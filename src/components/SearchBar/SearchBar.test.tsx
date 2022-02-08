import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'

import SearchBar from './SearchBar'

describe('SearchBar', () => {
    const history = createMemoryHistory()
    const placeholder = 'Zoek in het omgevingsbeleid'
    const defaultProps = {
        width: 'w-64',
        placeholder: placeholder,
        compInNavigation: true,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <Router history={history}>
                <SearchBar {...props} />
            </Router>
        )
        const searchBar = screen.getByPlaceholderText(
            'Zoek in het omgevingsbeleid'
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
        const searchQuery = 'Testing the SearchBar component'
        fireEvent.change(searchBar, { target: { value: searchQuery } })
        expect(searchBar.value).toBe(searchQuery)

        // Assertion searchBar type suggestions
        const suggestionTypes = [
            'beleidskeuzes',
            'ambities',
            'beleidsdoelen',
            'maatregelen',
            'beleidsregels',
        ]
        suggestionTypes.forEach(type => {
            expect(screen.getByText(type)).toBeTruthy()
        })

        // Check if url changes when user hits enter
        fireEvent.keyDown(searchBar, {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
        })
        expect(history.location.pathname).toBe(`/zoekresultaten`)
        expect(history.location.search).toBe(`?query=${searchQuery}`)
    })
})
