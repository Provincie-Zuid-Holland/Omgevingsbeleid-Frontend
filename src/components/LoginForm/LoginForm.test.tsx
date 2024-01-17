import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import AuthProvider from '@/context/AuthContext'

import LoginForm from './LoginForm'

const queryClient = new QueryClient()

describe('LoginForm', () => {
    const setup = () => {
        const loginStatePromise = Promise.resolve()
        const loginUserPromise = Promise.resolve()

        render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <LoginForm />
                    </AuthProvider>
                </QueryClientProvider>
            </MemoryRouter>
        )

        return {
            loginStatePromise,
            loginUserPromise,
        }
    }

    const fillLoginForm = () => {
        const inputUsername = screen.getByLabelText(
            'E-mailadres'
        ) as HTMLInputElement
        const inputPassword = screen.getByLabelText(
            'Wachtwoord'
        ) as HTMLInputElement
        fireEvent.change(inputUsername, { target: { value: 'E-mail' } })
        fireEvent.change(inputPassword, { target: { value: 'Password' } })

        return { inputUsername, inputPassword }
    }

    it('user can type their credentials', () => {
        setup()
        const { inputUsername, inputPassword } = fillLoginForm()

        expect(inputUsername).toBeTruthy()
        expect(inputPassword).toBeTruthy()

        expect(inputUsername.value).toBe('E-mail')
        expect(inputPassword.value).toBe('Password')
    })
})
