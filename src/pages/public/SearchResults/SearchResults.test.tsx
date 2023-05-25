import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import SearchResults from './SearchResults'

describe('SearchResults', () => {
    const setup = async () => {
        const path = `/zoekresultaten`
        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path={path} element={<SearchResults />} />
                </Routes>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const headerElement = screen.getByText(`Zoeken`)
        expect(headerElement).toBeTruthy()
    })
})
