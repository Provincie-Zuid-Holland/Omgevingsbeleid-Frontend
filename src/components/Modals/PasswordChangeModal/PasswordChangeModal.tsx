import { Button, FormikInput, Notification } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { usePasswordResetPost } from '@/api/fetchers'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import * as passwordReset from '@/validation/passwordReset'

/**
 * A modal to change the users password
 */

export default function PasswordChangeModal() {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { isPending, mutate } = usePasswordResetPost({
        mutation: {
            onSuccess: () => {
                setActiveModal(null)

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

    return (
        <Modal id="passwordReset" size="s" title="Wachtwoord wijzigen">
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
                {({ handleSubmit, isValid, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="">
                            <FormikInput
                                label="Huidig wachtwoord"
                                id="password-reset-current-password"
                                required
                                name="currentPassword"
                                type="password"
                                placeholder="Voer hier je huidig wachtwoord in"
                            />
                        </div>
                        <Notification className="my-4">
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
                        />
                        <div className="mt-4">
                            <FormikInput
                                id="password-reset-copy-new-password"
                                label="Herhaal nieuw wachtwoord"
                                required
                                name="newPasswordCopy"
                                type="password"
                                placeholder="Herhaal het nieuwe wachtwoord"
                            />
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                            <Button
                                type="button"
                                variant="link"
                                onPress={() => setActiveModal(null)}
                                data-testid="close-password-forget-popup">
                                Annuleren
                            </Button>
                            <Button
                                isDisabled={!isValid && !isSubmitting}
                                type="submit"
                                variant="cta"
                                isLoading={isPending}>
                                Wijzig
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>

            <Notification className="mt-4">
                <>
                    Ben je je huidige wachtwoord vergeten? Neem dan contact op
                    met
                    <a
                        href="mailto:omgevingsbeleid@pzh.nl?subject=Wachtwoord vergeten"
                        className="ml-1 underline"
                        data-testid="wachtwoord-reset-mail">
                        omgevingsbeleid@pzh.nl
                    </a>
                </>
            </Notification>
        </Modal>
    )
}
