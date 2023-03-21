import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import beleidskeuze from '@/config/objects/beleidskeuze'

import DynamicOverview from './DynamicOverview'

const queryClient = new QueryClient()

describe('DynamicOverview', () => {
    const defaultProps = {
        model: beleidskeuze,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <DynamicOverview {...props} />
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Beleidskeuzes')
        expect(element).toBeTruthy()
    })
})
