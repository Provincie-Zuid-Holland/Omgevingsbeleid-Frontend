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

    const setup = (customProps?: any, initialEntries: string[] = ['/']) => {
        const props = { ...defaultProps, ...customProps }
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={initialEntries}>
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
        const button = screen.getByRole('button', { name: 'Menu' })
        expect(button).toBeTruthy()
        fireEvent.click(button)
        const popupTitle = screen.queryByText('Omgevingsvisie')
        expect(popupTitle).toBeTruthy()
    })

    it('Hides the search bar on the search results page', () => {
        setup(undefined, ['/zoekresultaten'])
        expect(screen.queryByPlaceholderText('Zoeken')).toBeFalsy()
    })

    it('Shows the search bar outside of the search results page', () => {
        setup()
        expect(screen.getByPlaceholderText('Zoeken')).toBeTruthy()
    })
})
