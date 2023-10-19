import { useState } from 'react'
import { useParams } from 'react-router-dom'

import {
    useUsersUserUuidGet,
    useUsersUserUuidResetPasswordPost,
} from '@/api/fetchers'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

const UserGeneratePasswordModal = () => {
    const { uuid } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(1)
    const [newPassword, setNewPassword] = useState<string | null>(null)

    const CurrentStep = steps[step - 1]

    const { data } = useUsersUserUuidGet(uuid!, {
        query: { enabled: !!uuid },
    })

    const { mutateAsync, isLoading } = useUsersUserUuidResetPasswordPost({
        mutation: {
            onSuccess: res => {
                setNewPassword(res.NewPassword)
                setStep(2)

                toastNotification('userPasswordGenerated')
            },
        },
    })

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(1), 300)
    }

    /**
     * Handle generate password
     */
    const handleClick = () => mutateAsync({ userUuid: uuid! })

    return (
        <Modal
            id="userPasswordReset"
            title="Nieuw wachtwoord"
            hideTitle
            onClose={handleClose}>
            <CurrentStep
                handleClick={handleClick}
                handleClose={handleClose}
                newPassword={newPassword}
                user={data}
                isLoading={isLoading}
            />
        </Modal>
    )
}

export default UserGeneratePasswordModal
