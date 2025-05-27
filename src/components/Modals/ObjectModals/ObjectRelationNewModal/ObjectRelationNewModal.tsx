import { Button } from '@pzh-ui/components'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { RequestAcknowledgedRelation } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { ObjectRelationModalActions } from '../types'
import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface ObjectRelationNewModalProps extends ObjectRelationModalActions {
    model: Model
    queryKey?: QueryKey
    initialValues: RequestAcknowledgedRelation
}

const ObjectRelationNewModal = ({
    model,
    queryKey,
    initialValues,
    relations,
}: ObjectRelationNewModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(1)

    const { data, queryKey: objectQueryKey } = useObject()
    const { usePostAcknowledgedRelations } = model.fetchers

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(1), 300)
    }

    const postAcknowledgedRelations = usePostAcknowledgedRelations?.({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries({ queryKey }),
                    queryClient.invalidateQueries({ queryKey: objectQueryKey }),
                ]).then(handleClose)

                toastNotification('acknowledgedRelationSaved')
            },
        },
    })

    /**
     * Handle for submit
     */
    const handleFormSubmit = (
        payload: RequestAcknowledgedRelation,
        helpers: FormikHelpers<RequestAcknowledgedRelation>
    ) => {
        if (isFinalStep) {
            postAcknowledgedRelations?.mutate({
                lineageId: parseInt(objectId!),
                data: {
                    Object_ID: payload.Object_ID,
                    Object_Type: payload.Object_Type,
                    Explanation: payload.Explanation,
                },
            })
        } else {
            setStep(step + 1)
            helpers.setTouched({})
            helpers.setSubmitting(false)
        }
    }

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2
    const currentValidationSchema =
        objectRelation.SCHEMA_RELATION_STEPS[step - 1]

    return (
        <Modal
            id="objectRelationAdd"
            title="Verzoek tot beleidsrelatie"
            size="xl"
            onClose={handleClose}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    // @ts-ignore
                    currentValidationSchema
                )}
                enableReinitialize
                validateOnMount>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <CurrentStep
                            model={model}
                            title={data?.Title}
                            id={data?.Object_ID}
                            relations={relations}
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
                                        onPress={() => setStep(step - 1)}
                                        className="mr-3">
                                        Vorige stap
                                    </Button>
                                )}
                                <Button
                                    variant={isFinalStep ? 'cta' : 'primary'}
                                    type="button"
                                    isDisabled={isSubmitting || !isValid}
                                    onPress={submitForm}
                                    isLoading={isSubmitting}>
                                    {isFinalStep
                                        ? 'Verzoek versturen'
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

export default ObjectRelationNewModal
