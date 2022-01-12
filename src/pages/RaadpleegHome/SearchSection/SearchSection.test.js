import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { MemoryRouter } from 'react-router-dom'

import SearchSection from './SearchSection'

describe('SearchSection', () => {
    const setup = () => {
        render(
            <MemoryRouter>
                <SearchSection />
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Naar welk onderwerp ben je op zoek?')
        expect(element).toBeTruthy()
    })
})
