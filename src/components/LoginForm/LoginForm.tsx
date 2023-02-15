import {
    Button,
    FormikInput,
    Heading,
    Modal,
    Notification,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

import useAuth from '@/hooks/useAuth'

interface FormProps {
    email: string
    password: string
}

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Onjuist e-mailadres')
        .required('Dit veld is verplicht'),
    password: Yup.string().required('Dit veld is verplicht'),
})

/**
 * Displays a login form in which the user can log into the application.
 */

const LoginForm = () => {
    const navigate = useNavigate()
    const { signin } = useAuth()

    const [wachtwoordResetPopup, setWachtwoordResetPopup] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleFormSubmit = ({ email, password }: FormProps) => {
        setLoading(true)

        signin(email, password)
            .then(() => {
                setLoading(false)
                navigate('/muteer/dashboard', { replace: true })
            })
            .catch(err => {
                setLoading(false)
                setError(err?.data?.message || 'Er is iets mis gegaan.')
            })
    }

    return (
        <>
            <PopupPasswordForgot
                show={wachtwoordResetPopup}
                togglePopup={() =>
                    setWachtwoordResetPopup(!wachtwoordResetPopup)
                }
            />
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={handleFormSubmit}
                validationSchema={schema}>
                {({ values, handleSubmit, isValid, dirty }) => (
                    <Form onSubmit={handleSubmit}>
                        <FormikInput
                            label="E-mailadres"
                            name="email"
                            type="email"
                            placeholder="medewerker@pzh.nl"
                            value={values.email}
                        />
                        <div className="mt-6">
                            <FormikInput
                                label="Wachtwoord"
                                name="password"
                                type="password"
                                placeholder="Vul hier je wachtwoord in"
                                value={values.password}
                            />
                        </div>
                        <div className="flex items-center justify-between mt-7">
                            <Button
                                type="submit"
                                isDisabled={!isValid || !dirty}>
                                Inloggen
                            </Button>
                            <button
                                className="mt-4 text-sm underline cursor-pointer sm:mt-0 sm:ml-4 text-pzh-green hover:text-pzh-green-dark"
                                onClick={e => {
                                    e.preventDefault()
                                    setWachtwoordResetPopup(
                                        !wachtwoordResetPopup
                                    )
                                }}
                                tabIndex={0}>
                                Wachtwoord vergeten?
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4">
                                <span className=" text-pzh-red">{error}</span>
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
    show: boolean
    togglePopup: () => void
}

const PopupPasswordForgot = ({
    show,
    togglePopup,
}: PopupPasswordForgotProps) => (
    <Modal
        maxWidth="max-w-sm"
        open={show}
        onClose={togglePopup}
        closeButton
        ariaLabel="Wachtwoord vergeten">
        <Heading level="3">Wachtwoord vergeten</Heading>

        <Notification className="mt-2 mb-4">
            Binnenkort willen wij het mogelijk maken dat medewerkers van
            provincie Zuid-Holland automatisch kunnen inloggen. Tot die tijd
            moet het nog met een e-mailadres en een wachtwoord.
        </Notification>

        <p className="py-1 text-pzh-blue-dark">
            Wachtwoord vergeten? Stuur dan een e-mail naar het team
            Omgevingsbeleid door op de link te klikken. Je ontvangt dan binnen
            één werkdag een nieuw wachtwoord.
        </p>
        <div className="flex items-center justify-between mt-5">
            <button
                className="text-sm underline transition-colors cursor-pointer text-pzh-blue hover:text-pzh-blue-dark"
                onClick={togglePopup}
                id="close-password-forget-popup"
                data-testid="close-password-forget-popup">
                Annuleren
            </button>
            <Button
                variant="cta"
                id="wachtwoord-reset-button-mailto"
                data-testid="wachtwoord-reset-button-mailto"
                onPress={() => {
                    window.location.href =
                        'mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten'
                    togglePopup()
                }}>
                Mail versturen
            </Button>
        </div>
    </Modal>
)

export default LoginForm
