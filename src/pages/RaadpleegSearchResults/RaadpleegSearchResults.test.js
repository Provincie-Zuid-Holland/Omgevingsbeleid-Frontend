import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter, Route } from 'react-router-dom'

import RaadpleegSearchResults from './RaadpleegSearchResults'

describe('RaadpleegSearchResults', () => {
    const setup = async () => {
        const path = `/zoekresultaten`
        render(
            <MemoryRouter initialEntries={[path]}>
                <Route path={path}>
                    <RaadpleegSearchResults />
                </Route>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        screen.getByText(`Geen resultaten`)
    })
})
