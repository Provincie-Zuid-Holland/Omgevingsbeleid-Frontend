import { Button, Heading, Modal } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getModulesGetQueryKey,
    useModulesModuleIdCompletePost,
} from '@/api/fetchers'
import { CompleteModule } from '@/api/fetchers.schemas'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface ModuleCompleteModalProps {
    isOpen: boolean
    onClose: () => void
}

const ModuleCompleteModal = ({ isOpen, onClose }: ModuleCompleteModalProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { moduleId } = useParams()

    const [step, setStep] = useState(1)

    const completeModule = useModulesModuleIdCompletePost({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(getModulesGetQueryKey(), {
                        refetchType: 'all',
                    })
                    .then(() => {
                        handleClose()
                        navigate('/muteer/modules')
                    })

                toastNotification('moduleCompleted')
            },
        },
    })

    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => {
            setStep(1)
        }, 300)
    }

    const handleFormSubmit = (payload: CompleteModule) => {
        completeModule.mutate({
            moduleId: parseInt(moduleId!),
            data: payload,
        })
    }

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Module afsluiten"
            maxWidth="sm:max-w-[812px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={modules.EMPTY_SCHEMA_COMPLETE_MODULE}
                validationSchema={toFormikValidationSchema(
                    modules.SCHEMA_COMPLETE_MODULE
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <Heading
                            level="2"
                            className="mb-4 first-letter:uppercase">
                            Module afsluiten
                        </Heading>

                        <CurrentStep />

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
                                    onPress={() => {
                                        !isFinalStep ? setStep(2) : submitForm()
                                    }}
                                    isDisabled={
                                        (isFinalStep && !isValid) ||
                                        (isFinalStep && isSubmitting)
                                    }
                                    isLoading={isSubmitting}>
                                    {isFinalStep ? 'Opslaan' : 'Volgende stap'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ModuleCompleteModal
