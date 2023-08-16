import { Button, OLDModal as Modal } from '@pzh-ui/components'
import { QueryKey, useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { EditAcknowledgedRelation } from '@/api/fetchers.schemas'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { StepOne, StepTwo } from './steps'
import { ObjectRelationModalActions } from '../types'

const steps = [StepOne, StepTwo]

interface ObjectRelationApprovedModalProps extends ObjectRelationModalActions {
    model: Model
    onClose: () => void
    queryKey?: QueryKey
}

const ObjectRelationApprovedModal = ({
    isOpen,
    onClose,
    model,
    queryKey,
    relations,
}: ObjectRelationApprovedModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const [initialValues, setInitialValues] = useState({
        Object_Type: model.defaults.singular,
        Acknowledged: false,
        consent: false,
    } as EditAcknowledgedRelation & { Title?: string; consent: boolean })
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
     * Handle disconnect relation
     */
    const handleDisconnect = (Object_ID: number, Title?: string) => {
        setInitialValues({
            ...initialValues,
            Object_ID,
            Title,
        })
        setStep(2)
    }

    const postAcknowledgedRelations = usePatchAcknowledgedRelations?.({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(queryKey),
                    queryClient.invalidateQueries(objectQueryKey),
                ]).then(handleClose)

                toastNotification('acknowledgedRelationDisconnected')
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
                Acknowledged: false,
                Denied: true,
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
            maxWidth="sm:max-w-[1200px]"
            closeButton>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectRelation.SCHEMA_RELATION_DISCONNECT
                )}
                enableReinitialize>
                {({ values, isSubmitting, submitForm }) => (
                    <Form>
                        <CurrentStep
                            model={model}
                            title={data?.Title}
                            relations={relations}
                            handleDisconnect={handleDisconnect}
                        />
                        <div className="mt-6 flex items-center justify-between">
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
                                        (isFinalStep && !values.consent) ||
                                        (isFinalStep && isSubmitting)
                                    }
                                    onPress={() => {
                                        !isFinalStep
                                            ? handleClose()
                                            : submitForm()
                                    }}
                                    isLoading={isSubmitting}>
                                    {isFinalStep
                                        ? 'Beleidsrelatie verbreken'
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

export default ObjectRelationApprovedModal
