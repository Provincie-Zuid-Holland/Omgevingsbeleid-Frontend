import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import MapSearch from './MapSearch'

const queryClient = new QueryClient()

describe('MapSearch', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MapSearch {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        expect(screen.getByText('Zoeken op de kaart')).toBeTruthy()
    })
})
