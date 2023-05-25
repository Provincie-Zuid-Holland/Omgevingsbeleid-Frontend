import {
    Button,
    FormikInput,
    Heading,
    Modal,
    Notification,
} from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useEffect, useRef } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { usePasswordResetPost } from '@/api/fetchers'
import { toastNotification } from '@/utils/toastNotification'
import * as passwordReset from '@/validation/passwordReset'

/**
 * A modal to change the users password
 * @param {object} props
 * @param {function} props.setOpen - Function to set the open state of the modal
 */

interface PasswordChangeModalProps {
    isOpen: boolean
    setOpen: (state: boolean) => void
}

export default function PasswordChangeModal({
    isOpen,
    setOpen,
}: PasswordChangeModalProps) {
    const mailToAnchor = useRef<HTMLAnchorElement>(null)
    const closeBtn = useRef<HTMLButtonElement>(null)

    const { isLoading, mutate } = usePasswordResetPost({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                setOpen(false)

                toastNotification('passwordReset')
            },
        },
    })

    const handleFormSubmit = ({
        currentPassword,
        newPassword,
    }: {
        currentPassword: string
        newPassword: string
    }) => {
        mutate({
            params: {
                password: currentPassword,
                new_password: newPassword,
            },
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
        <Modal
            open={isOpen}
            onClose={() => setOpen(false)}
            ariaLabel="Wachtwoord wijzigen"
            maxWidth="sm:max-w-[600px]"
            closeButton>
            <Heading level="2" className="mb-4">
                Wachtwoord wijzigen
            </Heading>

            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    newPasswordCopy: '',
                }}
                onSubmit={handleFormSubmit}
                validationSchema={toFormikValidationSchema(
                    passwordReset.SCHEMA
                )}>
                {({ values, handleSubmit, isValid, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="">
                            <FormikInput
                                label="Huidig wachtwoord"
                                id="password-reset-current-password"
                                required
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
                            required
                            name="newPassword"
                            type="password"
                            placeholder="Geef hier het nieuwe wachtwoord op"
                            value={values.newPassword}
                        />
                        <div className="mt-4">
                            <FormikInput
                                id="password-reset-copy-new-password"
                                label="Herhaal nieuw wachtwoord"
                                required
                                name="newPasswordCopy"
                                type="password"
                                placeholder="Herhaal het nieuwe wachtwoord"
                                value={values.newPasswordCopy}
                            />
                        </div>

                        <div className="flex items-center justify-between mt-5">
                            <Button
                                type="button"
                                variant="link"
                                data-testid="close-password-forget-popup">
                                Annuleren
                            </Button>
                            <Button
                                isDisabled={!isValid && !isSubmitting}
                                type="submit"
                                variant="cta"
                                isLoading={isLoading}>
                                Wijzig
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>

            <Notification className="mt-4" size="small">
                <>
                    Ben je je huidige wachtwoord vergeten? Neem dan contact op
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
        </Modal>
    )
}
