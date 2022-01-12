import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import SearchResultItem from './SearchResultItem'
import { MemoryRouter } from 'react-router-dom'

describe('SearchResultItem', () => {
    const defaultProps = {
        item: {
            Omschrijving: 'Description',
            Titel: 'Test Title',
            Type: 'beleidskeuzes',
        },
        searchQuery: 'search query',
    }

    const setup = customProps => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <SearchResultItem {...props} />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Test Title')
        expect(element).toBeTruthy()
    })
})
