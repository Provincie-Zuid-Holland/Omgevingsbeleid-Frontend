import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'

import Login from './Login'

const mockedUsedNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
    useNavigate: () => mockedUsedNavigate,
}))

const queryClient = new QueryClient()

describe('Login', () => {
    it('should render', () => {
        render(
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Login />
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        )
        const header = screen.getByRole('heading', {
            name: 'Inloggen',
        })
        expect(header).toBeInTheDocument()
    })
})
