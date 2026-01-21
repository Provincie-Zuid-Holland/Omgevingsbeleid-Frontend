import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AreaOverview from './AreaOverview'

const queryClient = new QueryClient()

describe('AreaOverview', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AreaOverview {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', async () => {
        setup()

        waitFor(() => {
            const element = screen.getByText(/\d+ Gebiedsprogramma/)
            expect(element).toBeTruthy()
        })
    })
})
