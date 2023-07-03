import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import SearchResultItem from './SearchResultItem'

const { location } = window

let mockSearch: string

beforeEach(() => {
    delete (window as any).location
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search, ...restLocation } = location

    // @ts-ignore
    window.location = { ...restLocation }

    Object.defineProperty(window.location, 'search', {
        get: function () {
            return mockSearch
        },
    })
})

describe('SearchResultItem', () => {
    const defaultProps = {
        item: {
            Omschrijving: 'Description',
            Titel: 'Test Title',
            Type: 'beleidskeuze',
        },
        searchQuery: 'search query',
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        const path = `/zoekresultaten`

        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route
                        path={path}
                        element={<SearchResultItem {...props} />}
                    />
                </Routes>
            </MemoryRouter>
        )

        const marker = screen.getByTestId('marker')

        return { marker }
    }

    it('Component renders', () => {
        mockSearch = 'query=Test'

        const { marker } = setup()

        expect(marker.innerHTML).toBe('Test')
    })
})
