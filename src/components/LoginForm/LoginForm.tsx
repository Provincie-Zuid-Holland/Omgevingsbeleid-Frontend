import { useState } from 'react'
import { useHistory } from 'react-router-dom'

// Import API
import axios from '@/api/axios'
import { GetTokeninfo200Identifier } from '@/api/fetchers.schemas'

// Import Components
import { LoaderSpinner } from '../Loader'
import Modal from '../Modal'

interface PopupPasswordForgotProps {
    show: boolean
    togglePopup: () => void
}

/**
 * Displays a login form in which the user can log into the application.
 */

interface LoginFormProps {
    setLoginState: (e: boolean) => void
    setLoginUser: (identifier: GetTokeninfo200Identifier) => void
}

const LoginForm = ({ setLoginState, setLoginUser }: LoginFormProps) => {
    const history = useHistory()

    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [wachtwoordResetPopup, setWachtwoordResetPopup] = useState(false)

    const displayErrorMsg = () => {
        const errorEl = document.getElementById('error-message')
        errorEl?.classList.remove('hidden')
        errorEl?.classList.add('flex')
        errorEl?.classList.add('shake')

        setTimeout(() => {
            errorEl?.classList.remove('shake')
        }, 820)
    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        axios
            .post(
                'login',
                JSON.stringify({
                    identifier: identifier,
                    password: password,
                })
            )
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    const identifier = response.data.identifier

                    localStorage.setItem(
                        process.env.REACT_APP_KEY_IDENTIFIER || '',
                        JSON.stringify(identifier)
                    )
                    localStorage.setItem(
                        process.env.REACT_APP_KEY_API_ACCESS_TOKEN || '',
                        response.data.access_token
                    )
                    setLoading(false)
                    setLoginState(true)
                    setLoginUser(identifier)
                    history.push('/muteer/dashboard')
                }
            })
            .catch(err => {
                displayErrorMsg()
                setLoading(false)
            })
    }

    const handleErrorMessage = () => {
        const errorEl = document.getElementById('error-message')

        errorEl?.classList.add('hidden')
        errorEl?.classList.remove('flex')
    }

    return (
        <>
            <PopupPasswordForgot
                show={wachtwoordResetPopup}
                togglePopup={() =>
                    setWachtwoordResetPopup(!wachtwoordResetPopup)
                }
            />
            <form className="my-4 sm:my-8" onSubmit={handleFormSubmit}>
                <div>
                    <label
                        className="block mb-2 text-pzh-blue"
                        htmlFor="form-field-login-email">
                        E-mailadres
                    </label>
                    <input
                        required
                        className="w-full px-3 py-2 leading-loose placeholder-opacity-50 bg-white border rounded appearance-none bg-pzh-form border-pzh-blue-dark border-opacity-30 focus:outline-none focus:ring ring-pzh-blue-light placeholder-pzh-blue-dark "
                        name="email"
                        id="form-field-login-email"
                        data-testid="form-field-login-email"
                        type="text"
                        placeholder="medewerker@pzh.nl"
                        onChange={e => setIdentifier(e.target.value)}
                    />
                </div>
                <div className="my-4 sm:my-6">
                    <label
                        className="block mb-2 text-pzh-blue"
                        htmlFor="form-field-login-password">
                        Wachtwoord
                    </label>
                    <input
                        required
                        className="w-full px-3 py-2 leading-loose placeholder-opacity-50 bg-white border rounded appearance-none bg-pzh-form border-pzh-blue-dark border-opacity-30 focus:outline-none focus:ring ring-pzh-blue-light placeholder-pzh-blue-dark "
                        name="password"
                        id="form-field-login-password"
                        data-testid="form-field-login-password"
                        type="password"
                        placeholder="Vul hier je wachtwoord in"
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="flex flex-col items-start md:items-center md:justify-between md:flex-row">
                    <button
                        className="inline-block px-8 pt-2 pb-2 text-white transition-colors duration-200 ease-in rounded bg-pzh-blue hover:bg-pzh-blue-dark focus:outline-none focus:ring"
                        type="submit"
                        id="form-field-login-submit"
                        data-testid="form-field-login-submit">
                        {loading ? (
                            <span title="laden..." className="mr-2">
                                <LoaderSpinner />
                            </span>
                        ) : null}
                        Inloggen
                        {loading ? '...' : ''}
                    </button>
                    <button
                        className="mt-4 text-sm underline cursor-pointer sm:mt-0 sm:ml-4 text-pzh-green hover:text-pzh-green-dark"
                        onClick={e => {
                            e.preventDefault()
                            setWachtwoordResetPopup(!wachtwoordResetPopup)
                        }}
                        tabIndex={0}>
                        Wachtwoord vergeten?
                    </button>
                </div>
            </form>
            <div
                id="error-message"
                data-testid="error-message"
                className="container items-center justify-center hidden">
                <div
                    className="relative inline-block w-full px-4 py-3 pr-10 text-red-600 border rounded bg-red-lightest border-red-light"
                    role="alert">
                    <span className="block sm:inline">
                        Verkeerde e-mailadres of wachtwoord
                    </span>
                    <span
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={handleErrorMessage}>
                        <svg
                            className="w-6 h-6 fill-current text-red"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20">
                            <title>Sluiten</title>
                            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                        </svg>
                    </span>
                </div>
            </div>
        </>
    )
}

/**
 * Displays a popup in which the user can reset their password.
 */

interface PopupPasswordForgotProps {
    show: boolean
    togglePopup: () => void
}

const PopupPasswordForgot = ({
    show,
    togglePopup,
}: PopupPasswordForgotProps) => (
    <Modal maxWidth="max-w-sm" open={show} close={togglePopup}>
        <h3 className="mb-4 text-xl font-bold text-pzh-blue">
            Wachtwoord vergeten
        </h3>

        <div className="relative p-4 mb-4 border-l-4 bg-pzh-blue-super-light border-pzh-blue">
            <p className="mt-1 text-sm text-pzh-blue-dark">
                Binnenkort willen wij het mogelijk maken dat medewerkers van
                provincie Zuid-Holland automatisch kunnen inloggen. Tot die tijd
                moet het nog met een e-mailadres en een wachtwoord.
            </p>
        </div>

        <p className="py-1 text-pzh-blue-dark">
            Wachtwoord vergeten? Stuur dan een e-mail naar het team
            Omgevingsbeleid door op de link te klikken. Je ontvangt dan binnen
            één werkdag een nieuw wachtwoord.
        </p>
        <div className="flex items-end justify-between mt-5">
            <button
                className="text-sm underline transition-colors cursor-pointer text-pzh-blue hover:text-pzh-blue-dark"
                onClick={togglePopup}
                id="close-password-forget-popup"
                data-testid="close-password-forget-popup">
                Annuleren
            </button>
            <button
                className="inline-block px-8 py-2 text-white rounded pzh-transition-colors bg-pzh-green hover:bg-pzh-green-dark focus:outline-none focus:ring"
                id="wachtwoord-reset-button-mailto"
                data-testid="wachtwoord-reset-button-mailto"
                onClick={() => {
                    window.location.href =
                        'mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten'
                    togglePopup()
                }}>
                Mail versturen
            </button>
        </div>
    </Modal>
)

export default LoginForm
