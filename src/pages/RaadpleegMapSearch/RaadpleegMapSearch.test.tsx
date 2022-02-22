import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import RaadpleegMapSearch from './RaadpleegMapSearch'

const queryClient = new QueryClient()

const createMockMediaMatcher =
    (matches: Record<string, boolean>) => (qs: string) => ({
        matches: matches[qs] ?? false,
        addListener: () => {},
        removeListener: () => {},
    })

describe('RaadpleegMapSearch', () => {
    beforeEach(() => {
        window.matchMedia = createMockMediaMatcher({
            '(min-width: 500px)': true,
            '(min-width: 1000px)': false,
        }) as any
    })

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
