import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import AuthProvider from '@/context/AuthContext'

import MuteerDashboard from './MuteerDashboard'

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

describe('MuteerDashboard', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <MuteerDashboard {...props} />
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
