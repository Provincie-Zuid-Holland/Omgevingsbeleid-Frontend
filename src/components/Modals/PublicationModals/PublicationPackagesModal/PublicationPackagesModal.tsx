import { useState } from 'react'

import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface PublicationPackagesModalProps {
    initialStep?: number
}

const PublicationPackagesModal = ({
    initialStep = 1,
}: PublicationPackagesModalProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(initialStep)

    const CurrentStep = steps[step - 1]

    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => {
            setStep(initialStep)
        }, 300)
    }

    return (
        <Modal
            id="publicationPackages"
            title="Leveringen"
            hideTitle
            onClose={handleClose}
            size="xl">
            <CurrentStep setStep={setStep} />
        </Modal>
    )
}

export default PublicationPackagesModal
