import { Button, Modal } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdAddExistingObjectPost,
    useModulesModuleIdAddNewObjectPost,
} from '@/api/fetchers'
import {
    Module,
    ModuleAddExistingObject,
    ModuleAddNewObject,
    SearchObject,
} from '@/api/fetchers.schemas'
import { toastNotification } from '@/utils/toastNotification'
import * as modules from '@/validation/modules'

import { StepFive, StepFour, StepOne, StepThree, StepTwo } from './steps'

const steps = [StepOne, StepTwo, StepThree, StepFour, StepFive]

export type ContentsModalForm = (
    | ModuleAddNewObject
    | ModuleAddExistingObject
) & {
    state?: 'new' | 'existing'
}

interface ModuleContentsModalProps {
    isOpen: boolean
    onClose: () => void
    initialStep: number
    initialValues: ContentsModalForm
    module?: Module
    selectedObject?: SearchObject
}

const ModuleContentsModal = ({
    isOpen,
    onClose,
    initialStep = 1,
    initialValues,
    module,
    selectedObject,
}: ModuleContentsModalProps) => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const [step, setStep] = useState(initialStep)
    const [existingObject, setExistingObject] = useState<
        SearchObject | undefined
    >(selectedObject)

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 3 || step === 5

    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => {
            setExistingObject(undefined)
            setStep(initialStep)
        }, 300)
    }

    /**
     * Handle steps logic of wizard
     */
    const handleWizard = (
        state: ContentsModalForm['state'],
        prev?: boolean
    ) => {
        switch (step) {
            case 1:
                return state === 'new' ? setStep(2) : setStep(4)
            case 2:
                return prev ? setStep(1) : setStep(3)
            case 3:
                return setStep(2)
            case 4:
                return prev ? setStep(1) : setStep(5)
            case 5:
                return prev ? setStep(4) : setStep(5)
        }

        return
    }

    /**
     * Add new object to module
     */
    const addNewObjectToModule = useModulesModuleIdAddNewObjectPost({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                    )
                    .then(handleClose)

                toastNotification('saved')
            },
        },
    })

    /**
     * Add existing object to module
     */
    const addExistingObjectToModule = useModulesModuleIdAddExistingObjectPost({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                    )
                    .then(handleClose)

                toastNotification('saved')
            },
        },
    })

    /**
     * Handle submit of contents form
     */
    const handleFormSubmit = (
        payload: ContentsModalForm,
        helpers: FormikHelpers<ContentsModalForm>
    ) => {
        if (isFinalStep) {
            const { state, ...data } = payload

            if (state === 'new' && 'Object_Type' in data) {
                addNewObjectToModule.mutate({
                    moduleId: parseInt(moduleId!),
                    data,
                })
            } else if (state === 'existing' && 'Action' in data) {
                addExistingObjectToModule.mutate({
                    moduleId: parseInt(moduleId!),
                    data,
                })
            }
        } else {
            handleWizard(payload.state)
            helpers.setTouched({})
            helpers.setSubmitting(false)
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Onderdeel toevoegen aan een module"
            maxWidth="sm:max-w-[812px]"
            closeButton>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    // @ts-ignore
                    modules.SCHEMA_ADD_OBJECT_STEPS[step - 1]
                )}
                enableReinitialize
                validateOnBlur={false}>
                {({ values, isValid, isSubmitting }) => (
                    <Form>
                        <CurrentStep
                            title={module?.Title}
                            existingObject={existingObject}
                            setExistingObject={setExistingObject}
                        />
                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <div>
                                {step !== 1 && (
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        size="small"
                                        onPress={() =>
                                            handleWizard(values.state, true)
                                        }
                                        className="mr-3">
                                        Vorige stap
                                    </Button>
                                )}
                                <Button
                                    variant={isFinalStep ? 'cta' : 'primary'}
                                    size="small"
                                    type="submit"
                                    isDisabled={
                                        (isFinalStep && !isValid) ||
                                        (isFinalStep && isSubmitting)
                                    }
                                    isLoading={isSubmitting}>
                                    {isFinalStep
                                        ? 'Toevoegen'
                                        : 'Volgende stap'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ModuleContentsModal
