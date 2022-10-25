import { Button, FormikInput, Notification } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import { Form, Formik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useKey, useLockBodyScroll } from 'react-use'
import * as Yup from 'yup'

import { postPasswordReset } from '@/api/fetchers'

import { PopUpAnimatedContainer } from '../Popup'

const schema = Yup.object().shape({
    currentPassword: Yup.string().required('Vul je huidige wachtwoord in'),
    newPassword: Yup.string()
        .required('Vul een nieuw wachtwoord in')
        .min(12, 'Gebruik minimaal 12 tekens')
        .notOneOf(
            [Yup.ref('currentPassword')],
            'Het nieuwe wachtwoord mag niet gelijk zijn aan het oude wachtwoord'
        )
        .test(
            'password',
            'Gebruik minimaal 1 hoofdletter, 1 kleine letter, 1 cijfer en 1 speciaal teken',
            value => {
                if (value) {
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{12,}$/.test(
                        value
                    )
                }
                return true
            }
        ),
    newPasswordCopy: Yup.string()
        .required('Herhaal hier je nieuwe wachtwoord')
        .test(
            'equal',
            'Het herhaalde wachtwoord komt niet overeen',
            function (v) {
                const ref = Yup.ref('newPassword')
                return v === this.resolve(ref)
            }
        ),
})

/**
 * A modal to change the users password
 * @param {object} props
 * @param {function} props.setOpen - Function to set the open state of the modal
 */

interface PasswordChangeModalProps {
    setOpen: (state: boolean) => void
}

export default function PasswordChangeModal({
    setOpen,
}: PasswordChangeModalProps) {
    const [loading, setLoading] = useState(false)
    const mailToAnchor = useRef<HTMLAnchorElement>(null)
    const closeBtn = useRef<HTMLButtonElement>(null)
    const container = useRef<HTMLDivElement>(null)

    useKey('Escape', () => setOpen(false))

    useLockBodyScroll(true)

    const handleFormSubmit = ({
        currentPassword,
        newPassword,
    }: {
        currentPassword: string
        newPassword: string
    }) => {
        setLoading(true)
        postPasswordReset({
            password: currentPassword,
            new_password: newPassword,
        })
            .then(() => {
                setLoading(false)
                toast.success('Wachtwoord succesvol gewijzigd')
                setOpen(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        const mailToAnchorEl = mailToAnchor?.current
        const closeBtnEl = closeBtn?.current
        const currentPasswordInput = document.getElementById(
            'password-reset-current-password'
        )

        currentPasswordInput?.focus()

        const handleKeyEvent = (e: KeyboardEvent) => {
            if (e.shiftKey && e.code === 'Tab') {
                mailToAnchorEl?.focus()
            } else if (e.code === 'Tab') {
                closeBtnEl?.focus()
            }
        }

        mailToAnchorEl?.addEventListener('keydown', handleKeyEvent)
        closeBtnEl?.addEventListener('keydown', handleKeyEvent)

        return () => {
            closeBtnEl?.removeEventListener('keydown', handleKeyEvent)
            mailToAnchorEl?.removeEventListener('keydown', handleKeyEvent)
        }
    }, [])

    return (
        <PopUpAnimatedContainer small reference={container}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                    Wachtwoord wijzigen
                </h3>
                <button
                    ref={closeBtn}
                    onKeyDown={e => {
                        if (e.code === 'Enter') {
                            setOpen(false)
                        }
                    }}
                    onClick={() => setOpen(false)}
                    type="button"
                    className="py-1 pl-3 pr-1 text-gray-600 cursor-pointer hover:text-gray-800 pzh-transition-colors"
                    id={`password-reset-close`}
                    aria-label="Sluiten"
                    tabIndex={0}>
                    <Xmark />
                </button>
            </div>

            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    newPasswordCopy: '',
                }}
                onSubmit={handleFormSubmit}
                validationSchema={schema}>
                {({ values, handleSubmit, isValid, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="">
                            <FormikInput
                                label="Huidig wachtwoord"
                                id="password-reset-current-password"
                                required={true}
                                name="currentPassword"
                                type="password"
                                placeholder="Voer hier je huidig wachtwoord in"
                                value={values.currentPassword}
                            />
                        </div>
                        <Notification className="my-4" size="small">
                            Het nieuwe wachtwoord moet minimaal 12 karakters
                            bevatten en moet ten minste 1 cijfer, 1 speciaal
                            karakter en 1 hoofdletter bevatten.
                        </Notification>
                        <FormikInput
                            id="password-reset-new-password"
                            label="Nieuw wachtwoord"
                            required={true}
                            name="newPassword"
                            type="password"
                            placeholder="Geef hier het nieuwe wachtwoord op"
                            value={values.newPassword}
                        />
                        <FormikInput
                            id="password-reset-copy-new-password"
                            label="Herhaal nieuw wachtwoord"
                            required={true}
                            name="newPasswordCopy"
                            type="password"
                            placeholder="Herhaal het nieuwe wachtwoord"
                            value={values.newPasswordCopy}
                        />

                        <div className="flex items-center justify-between mt-5">
                            <button
                                className="text-sm text-gray-700 underline cursor-pointer hover:text-gray-900 pzh-transition-colors"
                                onClick={() => setOpen(false)}
                                type="button"
                                id="close-password-forget-popup"
                                data-testid="close-password-forget-popup">
                                Annuleren
                            </button>
                            <Button
                                isDisabled={!isValid && !isSubmitting}
                                type="submit"
                                variant="cta"
                                isLoading={loading}>
                                Wijzig
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>

            <Notification className="mt-4" size="small">
                <>
                    Ben je je huidig wachtwoord vergeten? Neem dan contact op
                    met
                    <a
                        ref={mailToAnchor}
                        href="mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten"
                        className="ml-1 underline"
                        id="wachtwoord-reset-mail">
                        omgevingsbeleid@pzh.nl
                    </a>
                </>
            </Notification>
        </PopUpAnimatedContainer>
    )
}
