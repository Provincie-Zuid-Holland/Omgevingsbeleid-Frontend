import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'

import SidebarMain from './SidebarMain'

const queryClient = new QueryClient()

describe('SidebarMain', () => {
    const defaultProps = {}

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <SidebarMain {...props} />
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        )
    }

    it('Component renders', () => {
        setup()
        const element = screen.getByText(
            'In deze omgeving heb je de mogelijkheid om te werken aan Omgevingsbeleid.'
        )
        expect(element).toBeTruthy()
    })
})
