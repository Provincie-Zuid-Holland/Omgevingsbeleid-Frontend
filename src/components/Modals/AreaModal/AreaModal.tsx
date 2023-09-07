import { Button, Heading, Modal } from '@pzh-ui/components'
import { Form, Formik } from 'formik'
import { useMemo, useState } from 'react'

import { useWerkingsgebiedenGet } from '@/api/fetchers'
import { Werkingsgebied } from '@/api/fetchers.schemas'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

export interface AreaProps {
    area?: string
    version?: string
    Title?: string
    Modified_Date?: string
}

interface AreaModalProps {
    isOpen: boolean
    onClose: () => void
    initialStep?: number
    handleFormSubmit: (payload: AreaProps) => void
}

const AreaModal = ({
    isOpen,
    onClose,
    initialStep = 1,
    handleFormSubmit,
}: AreaModalProps) => {
    const [step, setStep] = useState(initialStep)

    const { data, isLoading } = useWerkingsgebiedenGet({ limit: 500 }, {
        query: { enabled: isOpen },
    })

    /**
     * Group data by ID
     */
    const groupedData = useMemo(
        () =>
            data?.results.reduce((r, a) => {
                r[a.ID] = r[a.ID] || []
                r[a.ID].push(a)
                return r
            }, Object.create(null)) as
                | { [key: number]: Werkingsgebied[] }
                | undefined,
        [data]
    )

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    /**
     * Handle modal close
     */
    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    const handleSubmit = (payload: AreaProps) => {
        handleFormSubmit(payload)
        handleClose()
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Werkingsgebied koppelen"
            maxWidth="sm:max-w-[1200px]">
            <Formik
                onSubmit={handleSubmit}
                initialValues={{}}
                enableReinitialize>
                {({ isSubmitting, submitForm }) => (
                    <Form>
                        <Heading level="2" className="mb-4">
                            Werkingsgebied koppelen
                        </Heading>

                        <CurrentStep data={groupedData} isLoading={isLoading} />

                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <div>
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
