import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route } from 'react-router-dom'

import SearchResultItem from './SearchResultItem'

describe('SearchResultItem', () => {
    const defaultProps = {
        item: {
            Omschrijving: 'Description',
            Titel: 'Test Title',
            Type: 'beleidskeuzes',
        },
        searchQuery: 'search query',
        Type: 'beleidskeuzes',
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        const path = `/zoekresultaten?query=Water`
        render(
            <Route path={path}>
                <MemoryRouter initialEntries={[path]}>
                    <SearchResultItem {...props} />
                </MemoryRouter>
            </Route>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test Title')
        expect(element).toBeTruthy()
    })
})
