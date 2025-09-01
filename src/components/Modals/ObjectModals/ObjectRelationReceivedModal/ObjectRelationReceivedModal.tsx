import { Button } from '@pzh-ui/components'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    AcknowledgedRelation,
    EditAcknowledgedRelation,
} from '@/api/fetchers.schemas'
import Modal from '@/components/Modal'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { ModalFooter } from '@/components/Modal/Modal'
import { ObjectRelationModalActions } from '../types'
import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface ObjectRelationReceivedModalProps extends ObjectRelationModalActions {
    model: Model
    queryKey?: QueryKey
}

const ObjectRelationReceivedModal = ({
    model,
    queryKey,
    relations,
    history,
}: ObjectRelationReceivedModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [initialValues, setInitialValues] = useState({
        Object_Type: model.defaults.singular,
    } as EditAcknowledgedRelation & { Title?: string | null })
    const [actionType, setActionType] = useState<'accept' | 'deny' | null>(null)
    const [step, setStep] = useState(1)

    const { data, queryKey: objectQueryKey } = useObject()
    const { usePatchAcknowledgedRelations } = model.fetchers
    const { getAcknowledgedRelations } = model.queryKeys || {}

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)

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
        setActionType(action)
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
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries({ queryKey }),
                    queryClient.invalidateQueries({
                        queryKey: getAcknowledgedRelations?.(
                            initialValues.Object_ID
                        ),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({ queryKey: objectQueryKey }),
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
                Acknowledged: actionType === 'accept' ? true : false,
                Denied: actionType === 'deny' ? true : false,
            },
        })
    }

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    return (
        <Modal
            id="objectRelationReceived"
            title="Gelegde beleidsrelaties"
            hideTitle
            onClose={handleClose}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectRelation.SCHEMA_RELATION_EDIT
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <CurrentStep
                            model={model}
                            title={data?.Title}
                            relations={relations}
                            history={history}
                            handleAction={handleAction}
                            actionType={actionType}
                        />
                        <ModalFooter className="mt-4">
                            {step !== 1 && (
                                <Button variant="link" onPress={handleClose}>
                                    Annuleren
                                </Button>
                            )}

                            <div className="ml-auto">
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
                                        ? `Verzoek ${
                                              actionType === 'accept'
                                                  ? 'accepteren'
                                                  : 'afwijzen'
                                          }`
                                        : 'Sluiten'}
                                </Button>
                            </div>
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectRelationReceivedModal
