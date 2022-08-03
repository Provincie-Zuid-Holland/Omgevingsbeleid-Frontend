import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'

import InProgress from './InProgress'

const queryClient = new QueryClient()

describe('InProgress', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <InProgress {...props} />
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText('In bewerking')
        expect(element).toBeTruthy()
    })
})
