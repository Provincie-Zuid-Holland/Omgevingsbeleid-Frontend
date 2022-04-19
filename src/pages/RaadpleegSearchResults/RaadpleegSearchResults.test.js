import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import './../../mocks/matchMedia'
import RaadpleegSearchResults from './RaadpleegSearchResults'

describe('RaadpleegSearchResults', () => {
    const setup = async () => {
        const path = `/zoekresultaten`
        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route path={path} element={<RaadpleegSearchResults />} />
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
