import { Button, FormikInput, Notification } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import useAuth from '@/hooks/useAuth'
import useModalStore from '@/store/modalStore'
import * as loginForm from '@/validation/loginForm'

import { AxiosError } from 'axios'
import Modal from '../Modal'
import { ModalFooter } from '../Modal/Modal'

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
            .catch((err: AxiosError<{ detail: string }>) => {
                setLoading(false)
                err?.response &&
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
                            autoComplete="email"
                        />
                        <div className="mt-6">
                            <FormikInput
                                label="Wachtwoord"
                                name="password"
                                type="password"
                                placeholder="Vul hier je wachtwoord in"
                                autoComplete="current-password"
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
                                className="text-s text-pzh-green-500 hover:text-pzh-green-900 mt-4 cursor-pointer underline sm:mt-0 sm:ml-4"
                                onClick={() => setActiveModal('passwordForget')}
                                tabIndex={0}>
                                Wachtwoord vergeten?
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4">
                                <span className="text-pzh-red-500">
                                    {error}
                                </span>
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
    <Modal id="passwordForget" title="Wachtwoord vergeten">
        <Notification>
            Binnenkort willen wij het mogelijk maken dat medewerkers van
            provincie Zuid-Holland automatisch kunnen inloggen. Tot die tijd
            moet het nog met een e-mailadres en een wachtwoord.
        </Notification>

        <p className="text-pzh-blue-900">
            Wachtwoord vergeten? Stuur dan een e-mail naar het team
            Omgevingsbeleid door op de link te klikken. Je ontvangt dan binnen
            één werkdag een nieuw wachtwoord.
        </p>

        <ModalFooter>
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
                        'mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten (Platform Omgevingsbeleid)'
                    onClose()
                }}>
                Mail versturen
            </Button>
        </ModalFooter>
    </Modal>
)

export default LoginForm
