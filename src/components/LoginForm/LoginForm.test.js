import { render, screen, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'

import LoginForm from './LoginForm'

const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
        push: mockHistoryPush,
    }),
}))

describe('LoginForm', () => {
    const setup = () => {
        const loginStatePromise = Promise.resolve()
        const loginUserPromise = Promise.resolve()

        const setLoginState = jest.fn(() => loginStatePromise)
        const setLoginUser = jest.fn(() => loginUserPromise)

        render(
            <MemoryRouter>
                <LoginForm
                    setLoginState={setLoginState}
                    setLoginUser={setLoginUser}
                />
            </MemoryRouter>
        )

        return {
            setLoginState,
            setLoginUser,
            loginStatePromise,
            loginUserPromise,
        }
    }

    const fillLoginForm = () => {
        const inputUsername = screen.getByLabelText('E-mailadres')
        const inputPassword = screen.getByLabelText('Wachtwoord')
        fireEvent.change(inputUsername, { target: { value: 'E-mail' } })
        fireEvent.change(inputPassword, { target: { value: 'Password' } })

        return { inputUsername, inputPassword }
    }

    it('should render', () => {
        setup()

        const emailLabel = screen.getByText('E-mailadres')
        expect(emailLabel).toBeTruthy()

        const wachtwoord = screen.getByText('Wachtwoord')
        expect(wachtwoord).toBeTruthy()
    })

    it('user can type their credentials', () => {
        setup()
        const { inputUsername, inputPassword } = fillLoginForm()

        expect(inputUsername).toBeTruthy()
        expect(inputPassword).toBeTruthy()

        expect(inputUsername.value).toBe('E-mail')
        expect(inputPassword.value).toBe('Password')
    })

    it('user can submit the login form', async () => {
        const { setLoginState, setLoginUser } = setup()

        const submitButton = screen.getByText('Inloggen')

        fillLoginForm()
        fireEvent.click(submitButton)

        await waitFor(() => screen.findByText('Inloggen...'))
        await waitFor(() => screen.findByText('Inloggen'))

        expect(setLoginState).toBeCalledTimes(1)
        expect(setLoginUser).toBeCalledTimes(1)
    })

    it('user can reset their password', async () => {
        setup()
        const forgetPassword = screen.getByText('Wachtwoord vergeten?')

        fireEvent.click(forgetPassword)

        await waitFor(() => screen.findByText('Wachtwoord vergeten'))

        expect(screen.getByText('Mail versturen')).toBeInTheDocument()
    })
})
