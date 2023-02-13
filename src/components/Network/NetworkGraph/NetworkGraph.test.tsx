import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import NetworkGraph from './NetworkGraph'

const queryClient = new QueryClient()

const initialize = async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <NetworkGraph />
            </MemoryRouter>
        </QueryClientProvider>
    )
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('NetworkGraph', () => {
    it('should render', async () => {
        await initialize()

        const title = screen.getByText('Beleidsnetwerk')
        expect(title).toBeInTheDocument()
    })
})
