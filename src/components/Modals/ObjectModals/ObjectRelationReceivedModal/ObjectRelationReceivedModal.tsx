import { Button, Heading, Modal } from '@pzh-ui/components'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    AcknowledgedRelation,
    EditAcknowledgedRelation,
} from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { ObjectRelationModalActions } from '../types'
import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface ObjectRelationReceivedModalProps extends ObjectRelationModalActions {
    model: Model
    onClose: () => void
    queryKey?: QueryKey
}

const ObjectRelationReceivedModal = ({
    isOpen,
    onClose,
    model,
    queryKey,
    relations,
}: ObjectRelationReceivedModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const [initialValues, setInitialValues] = useState({
        Object_Type: model.defaults.singular,
    } as EditAcknowledgedRelation)
    const [step, setStep] = useState(1)

    const { data, queryKey: objectQueryKey } = useObject()
    const { usePatchAcknowledgedRelations } = model.fetchers

    /**
     * Handle modal close
     */
    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(1), 300)
    }

    /**
     * Handle relation action
     */
    const handleAction = (
        action: 'accept' | 'deny',
        relation: AcknowledgedRelation
    ) => {
        setInitialValues({
            ...initialValues,
            Object_ID: relation.Side_B.Object_ID,
            Explanation: relation.Side_A.Explanation,
            Title: relation.Side_B.Title,
        })
        setStep(2)
    }

    const postAcknowledgedRelations = usePatchAcknowledgedRelations?.({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(queryKey),
                    queryClient.invalidateQueries(objectQueryKey),
                ]).then(handleClose)

                toastNotification('acknowledgedRelationPatched')
            },
        },
    })

    /**
     * Handle for submit
     */
    const handleFormSubmit = (payload: EditAcknowledgedRelation) => {
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
            ariaLabel="Gelegde beleidsrelaties"
            maxWidth="sm:max-w-[1200px]">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectRelation.SCHEMA_RELATION_EDIT
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <Heading level="2" className="mb-2">
                            Binnengekomen verzoeken
                        </Heading>
                        <CurrentStep
                            model={model}
                            title={data?.Title}
                            relations={relations}
                            handleAction={handleAction}
                        />
                        <div className="mt-6 flex items-center justify-between">
                            {step !== 1 && (
                                <Button variant="link" onPress={handleClose}>
                                    Annuleren
                                </Button>
                            )}

                            <div className="ml-auto">
                                {step !== 1 && (
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className="mr-3">
                                        Verzoek verwijderen
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
                                            ? handleClose()
                                            : submitForm()
                                    }}
                                    isLoading={isSubmitting}>
                                    {isFinalStep
                                        ? 'Verzoek updaten'
                                        : 'Sluiten'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectRelationReceivedModal