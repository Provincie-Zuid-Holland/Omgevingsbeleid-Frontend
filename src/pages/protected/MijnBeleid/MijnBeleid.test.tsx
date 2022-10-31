import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'

import AuthProvider from '@/context/AuthContext'

import MijnBeleid from './MijnBeleid'

const queryClient = new QueryClient()

describe('MijnBeleid', () => {
    const defaultProps = {
        authUser: {
            UUID: '0000-0000-0000-0000',
        },
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <MijnBeleid {...props} />
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
