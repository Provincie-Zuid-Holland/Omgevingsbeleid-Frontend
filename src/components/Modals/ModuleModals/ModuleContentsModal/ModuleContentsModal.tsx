import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { Button } from '@pzh-ui/components'

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
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
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
    initialStep: number
    initialValues: ContentsModalForm
    module?: Module
    selectedObject?: SearchObject
}

const ModuleContentsModal = ({
    initialStep = 1,
    initialValues,
    module,
    selectedObject,
}: ModuleContentsModalProps) => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(initialStep)
    const [existingObject, setExistingObject] = useState<
        SearchObject | undefined
    >(selectedObject)

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 3 || step === 5
    const currentValidationSchema = modules.SCHEMA_ADD_OBJECT_STEPS[step - 1]

    const handleClose = () => {
        setActiveModal(null)

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

    const hasError = useMemo(
        () => addExistingObjectToModule.isError || addNewObjectToModule.isError,
        [addExistingObjectToModule.isError, addNewObjectToModule.isError]
    )

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
            id="moduleAddObject"
            title="Onderdeel toevoegen aan een module"
            hideTitle
            onClose={handleClose}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    // @ts-ignore
                    currentValidationSchema
                )}
                enableReinitialize
                validateOnBlur={false}>
                {({ values, isValid, isSubmitting, submitForm }) => (
                    <Form onSubmit={e => e.preventDefault()}>
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
                                    isDisabled={
                                        ((isFinalStep && !isValid) ||
                                            (isFinalStep && isSubmitting)) &&
                                        !hasError
                                    }
                                    isLoading={isSubmitting && !hasError}
                                    onPress={submitForm}>
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
