import { Button } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getModulesGetQueryKey,
    useModulesModuleIdCompletePost,
} from '@/api/fetchers'
import { CompleteModule } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

const ModuleCompleteModal = () => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(1)

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    const completeModule = useModulesModuleIdCompletePost({
        mutation: {
            onSuccess: () => {
                queryClient
                    .invalidateQueries({
                        queryKey: getModulesGetQueryKey(),
                        refetchType: 'all',
                    })
                    .then(() => {
                        handleClose()
                        navigate('/muteer')
                    })

                toastNotification('moduleCompleted')
            },
        },
    })

    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => {
            setStep(1)
        }, 300)
    }

    const handleFormSubmit = (
        payload: CompleteModule,
        helpers: FormikHelpers<CompleteModule>
    ) => {
        if (isFinalStep) {
            completeModule.mutate({
                moduleId: parseInt(moduleId!),
                data: payload,
            })
        } else {
            setStep(2)
            helpers.setTouched({})
            helpers.setSubmitting(false)
        }
    }

    return (
        <Modal
            id="moduleComplete"
            title="Module afsluiten"
            onClose={handleClose}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={modules.EMPTY_SCHEMA_COMPLETE_MODULE}
                validationSchema={toFormikValidationSchema(
                    // @ts-ignore
                    modules.SCHEMA_COMPLETE_MODULE_STEPS[step - 1]
                )}
                enableReinitialize>
                {({ isValid, isSubmitting }) => (
                    <Form>
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
                                    type="submit"
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
