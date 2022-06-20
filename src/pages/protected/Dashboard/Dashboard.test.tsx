import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import AuthProvider from '@/context/AuthContext'

import Dashboard from './Dashboard'

const queryClient = new QueryClient()

describe('Dashboard', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Dashboard {...props} />
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getAllByText('Mijn beleid')
        expect(element).toBeTruthy()
    })
})
