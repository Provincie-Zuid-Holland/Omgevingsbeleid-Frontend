import { Button, Heading, Modal } from '@pzh-ui/components'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { RequestAcknowledgedRelation } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { ObjectRelationModalActions } from '../types'
import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface ObjectRelationNewModalProps extends ObjectRelationModalActions {
    model: Model
    onClose: () => void
    queryKey?: QueryKey
    initialValues: RequestAcknowledgedRelation
}

const ObjectRelationNewModal = ({
    isOpen,
    onClose,
    model,
    queryKey,
    initialValues,
    relations,
}: ObjectRelationNewModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const [step, setStep] = useState(1)

    const { data, queryKey: objectQueryKey } = useObject()
    const { usePostAcknowledgedRelations } = model.fetchers

    /**
     * Handle modal close
     */
    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(1), 300)
    }

    const postAcknowledgedRelations = usePostAcknowledgedRelations?.({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(queryKey),
                    queryClient.invalidateQueries(objectQueryKey),
                ]).then(handleClose)

                toastNotification('acknowledgedRelationSaved')
            },
        },
    })

    /**
     * Handle for submit
     */
    const handleFormSubmit = (payload: RequestAcknowledgedRelation) => {
        postAcknowledgedRelations?.mutate({
            lineageId: parseInt(objectId!),
            data: {
                Object_ID: payload.Object_ID,
                Object_Type: payload.Object_Type,
                Explanation: payload.Explanation,
            },
        })
    }

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Verzoek tot beleidsrelatie"
            maxWidth="sm:max-w-[1200px]"
            closeButton>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectRelation.SCHEMA_RELATION_ADD
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <Heading level="2" className="mb-2">
                            Verzoek tot beleidsrelatie
                        </Heading>
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
                                    isDisabled={
                                        (isFinalStep && !isValid) ||
                                        (isFinalStep && isSubmitting)
                                    }
                                    onPress={() => {
                                        !isFinalStep
                                            ? setStep(step + 1)
                                            : submitForm()
                                    }}
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
