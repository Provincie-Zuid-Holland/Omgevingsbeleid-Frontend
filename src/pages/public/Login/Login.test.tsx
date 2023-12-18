import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'

import Login from './Login'

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
