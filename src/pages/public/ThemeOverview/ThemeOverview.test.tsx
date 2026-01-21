import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import ThemeOverview from './ThemeOverview'

const queryClient = new QueryClient()

describe('ThemeOverview', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ThemeOverview {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', async () => {
        setup()

        waitFor(() => {
            expect(
                screen.getByText(/De \d+ thematische programma’s/)
            ).toBeInTheDocument()
        })
    })
})
