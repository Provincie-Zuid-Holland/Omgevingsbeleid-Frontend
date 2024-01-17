import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'

import Navigation from './Navigation'

describe('Navigation', () => {
    const queryClient = new QueryClient()
    const setLoginStateMock = vi.fn()
    const defaultProps = {
        setLoginState: setLoginStateMock,
        loggedIn: false,
    }

    const setup = (customProps?: any) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AuthProvider>
                        <Navigation {...props} />
                    </AuthProvider>
                </MemoryRouter>
            </QueryClientProvider>
        )
    }

    it('Component renders', () => {
        setup()
        const search = screen.getByText('Inloggen')
        expect(search).toBeTruthy()
    })

    it('Toggles the menu', () => {
        setup()
        const button = screen.getByRole('button')
        expect(button).toBeTruthy()
        fireEvent.click(button)
        const popupTitle = screen.queryByText('Omgevingsvisie')
        expect(popupTitle).toBeTruthy()
    })
})
