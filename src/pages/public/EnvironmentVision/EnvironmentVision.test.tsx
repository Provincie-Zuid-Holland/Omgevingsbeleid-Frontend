import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import EnvironmentVision from './EnvironmentVision'

const queryClient = new QueryClient()

describe('EnvironmentVision', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <EnvironmentVision {...props} />
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('Inleidende hoofdstukken')
        expect(element).toBeTruthy()
    })
})
