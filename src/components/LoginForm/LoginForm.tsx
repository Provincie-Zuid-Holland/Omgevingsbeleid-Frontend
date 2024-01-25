import { Button, FormikInput, Notification } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import useAuth from '@/hooks/useAuth'
import useModalStore from '@/store/modalStore'
import * as loginForm from '@/validation/loginForm'

import Modal from '../Modal'

interface FormProps {
    email: string
    password: string
}

/**
 * Displays a login form in which the user can log into the application.
 */

const LoginForm = () => {
    const navigate = useNavigate()
    const { signin } = useAuth()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleFormSubmit = ({ email, password }: FormProps) => {
        setLoading(true)

        signin(email, password)
            .then(() => {
                setLoading(false)
                navigate('/muteer')
            })
            .catch(err => {
                setLoading(false)
                setError(
                    err?.response?.data?.detail ===
                        'Incorrect email or password'
                        ? 'Onjuist e-mailadres of wachtwoord'
                        : 'Er is iets mis gegaan.'
                )
            })
    }

    return (
        <>
            <PopupPasswordForgot onClose={() => setActiveModal(null)} />
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={handleFormSubmit}
                validationSchema={toFormikValidationSchema(loginForm.SCHEMA)}>
                {({ handleSubmit, isValid, dirty }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormikInput
                            label="E-mailadres"
                            name="email"
                            type="email"
                            placeholder="medewerker@pzh.nl"
                        />
                        <div className="mt-6">
                            <FormikInput
                                label="Wachtwoord"
                                name="password"
                                type="password"
                                placeholder="Vul hier je wachtwoord in"
                            />
                        </div>
                        <div className="mt-7 flex items-center justify-between">
                            <Button
                                type="submit"
                                isDisabled={!isValid || !dirty}
                                isLoading={loading}>
                                Inloggen
                            </Button>
                            <button
                                type="button"
                                className="mt-4 cursor-pointer text-s text-pzh-green underline hover:text-pzh-green-dark sm:ml-4 sm:mt-0"
                                onClick={() => setActiveModal('passwordForget')}
                                tabIndex={0}>
                                Wachtwoord vergeten?
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4">
                                <span className="text-pzh-red">{error}</span>
                            </div>
                        )}
                    </Form>
                )}
            </Formik>
        </>
    )
}

/**
 * Displays a popup in which the user can reset their password.
 */

interface PopupPasswordForgotProps {
    onClose: () => void
}

const PopupPasswordForgot = ({ onClose }: PopupPasswordForgotProps) => (
    <Modal id="passwordForget" size="s" title="Wachtwoord vergeten">
        <Notification className="mb-4 mt-2">
            Binnenkort willen wij het mogelijk maken dat medewerkers van
            provincie Zuid-Holland automatisch kunnen inloggen. Tot die tijd
            moet het nog met een e-mailadres en een wachtwoord.
        </Notification>

        <p className="py-1 text-pzh-blue-dark">
            Wachtwoord vergeten? Stuur dan een e-mail naar het team
            Omgevingsbeleid door op de link te klikken. Je ontvangt dan binnen
            één werkdag een nieuw wachtwoord.
        </p>
        <div className="mt-5 flex items-center justify-between">
            <Button
                variant="link"
                onPress={onClose}
                data-testid="close-password-forget-popup">
                Annuleren
            </Button>
            <Button
                variant="cta"
                id="wachtwoord-reset-button-mailto"
                data-testid="wachtwoord-reset-button-mailto"
                onPress={() => {
                    window.location.href =
                        'mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten'
                    onClose()
                }}>
                Mail versturen
            </Button>
        </div>
    </Modal>
)

export default LoginForm
