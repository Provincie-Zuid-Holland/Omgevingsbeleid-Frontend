import { Button } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import groupBy from 'lodash.groupby'
import { useMemo, useState } from 'react'

import { useSourceWerkingsgebiedenGet } from '@/api/fetchers'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

export interface AreaProps {
    area?: string
    version?: string
    Title?: string
    Modified_Date?: string
}

interface AreaModalProps {
    initialValues?: AreaProps
    initialStep?: number
    handleFormSubmit: (payload: AreaProps) => void
}

const AreaModal = ({
    initialStep = 1,
    initialValues = {},
    handleFormSubmit,
}: AreaModalProps) => {
    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(initialStep)

    const { data, isLoading } = useSourceWerkingsgebiedenGet(
        { limit: 1000 },
        {
            query: { enabled: activeModal === 'areaAdd' },
        }
    )

    /**
     * Group data by Title
     */
    const groupedData = useMemo(() => groupBy(data?.results, 'Title'), [data])

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    const handleSubmit = (payload: AreaProps) => {
        handleFormSubmit(payload)
        handleClose()
    }

    return (
        <Modal
            id="areaAdd"
            title="Werkingsgebied koppelen"
            size="xl"
            onClose={handleClose}>
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                enableReinitialize>
                {({ isSubmitting, submitForm }) => (
                    <Form>
                        <CurrentStep data={groupedData} isLoading={isLoading} />

                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <div>
                                {step !== 1 && (
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        onPress={() => setStep(1)}
                                        className="mr-3">
                                        Vorige stap
                                    </Button>
                                )}
                                <Button
                                    variant={isFinalStep ? 'cta' : 'primary'}
                                    type="button"
                                    isDisabled={isSubmitting}
                                    onPress={() => {
                                        !isFinalStep
                                            ? setStep(step + 1)
                                            : submitForm()
                                    }}>
                                    {isFinalStep ? 'Koppelen' : 'Volgende stap'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default AreaModal
