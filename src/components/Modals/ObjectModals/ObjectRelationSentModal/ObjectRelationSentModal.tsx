import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { Button } from '@pzh-ui/components'

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

import { ObjectRelationModalActions } from '../types'
import { StepOne, StepTwo } from './steps'

const steps = [StepOne, StepTwo]

interface ObjectRelationSentModalProps extends ObjectRelationModalActions {
    model: Model
    queryKey?: QueryKey
}

const ObjectRelationSentModal = ({
    model,
    queryKey,
    relations,
    history,
}: ObjectRelationSentModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [initialValues, setInitialValues] = useState({
        Object_Type: model.defaults.singular,
    } as EditAcknowledgedRelation & { Title?: string })
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
     * Handle edit relation
     */
    const handleEdit = (relation: AcknowledgedRelation) => {
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
                    queryClient.invalidateQueries(queryKey),
                    queryClient.invalidateQueries(
                        getAcknowledgedRelations?.(initialValues.Object_ID),
                        {
                            refetchType: 'all',
                        }
                    ),
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

    const handleDeleteRelation = () => {
        postAcknowledgedRelations?.mutate({
            lineageId: parseInt(objectId!),
            data: {
                Deleted: true,
                Object_ID: initialValues.Object_ID,
                Object_Type: initialValues.Object_Type,
            },
        })
    }

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    return (
        <Modal
            id="objectRelationSent"
            title="Gelegde beleidsrelaties"
            hideTitle
            size="xl">
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
                            handleEdit={handleEdit}
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
                                        className="mr-3"
                                        onPress={handleDeleteRelation}>
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

export default ObjectRelationSentModal
