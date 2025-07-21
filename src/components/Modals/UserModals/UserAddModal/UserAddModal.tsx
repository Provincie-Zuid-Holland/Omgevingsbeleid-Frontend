import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { useState } from 'react'

import {
    getUserGetSearchUsersQueryKey,
    useUserPostCreateUser,
} from '@/api/fetchers'
import { UserCreate, UserCreateResponse } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

const UserAddModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(1)
    const [createdUser, setCreatedUser] = useState<UserCreateResponse | null>(
        null
    )

    const CurrentStep = steps[step - 1]

    const { mutateAsync } = useUserPostCreateUser()

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(1), 300)
    }

    const handleSubmit = (
        user: UserCreate,
        helpers: FormikHelpers<UserCreate>
    ) => {
        mutateAsync(
            { data: user },
            {
                onSuccess: res => {
                    queryClient.invalidateQueries({
                        queryKey: getUserGetSearchUsersQueryKey(),
                        refetchType: 'all',
                    })

                    setCreatedUser(res)
                    setStep(2)

                    toastNotification('userCreated')
                },
            }
        ).catch(err => handleError<UserCreate>(err.response, helpers))
    }

    return (
        <Modal
            id="userAdd"
            title="Gebruiker toevoegen"
            hideTitle
            onClose={handleClose}>
            <CurrentStep
                handleSubmit={handleSubmit}
                handleClose={handleClose}
                createdUser={createdUser}
            />
        </Modal>
    )
}

export default UserAddModal
