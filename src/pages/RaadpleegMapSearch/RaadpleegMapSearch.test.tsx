import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import RaadpleegMapSearch from './RaadpleegMapSearch'

const queryClient = new QueryClient()

describe('RaadpleegMapSearch', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RaadpleegMapSearch {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        expect(screen.getByText('Zoeken op de kaart')).toBeTruthy()
    })
})
