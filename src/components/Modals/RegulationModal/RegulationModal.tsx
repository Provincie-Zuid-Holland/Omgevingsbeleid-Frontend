import { Button, Heading, Modal } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { useRegulationsGet } from '@/api/fetchers'
import { RegulationObjectOverwrite } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import getPropertyByName from '@/utils/getPropertyByName'
import { toastNotification } from '@/utils/toastNotification'
import * as regulationConnection from '@/validation/regulationConnection'

import { StepOne, StepTwo } from './steps'
import { RegulationModalActions } from './types'

const steps = [StepOne, StepTwo]

interface ObjectConnectionModalProps extends RegulationModalActions {
    model: Model
    onClose: () => void
}

const RegulationModal = ({
    model,
    isOpen,
    onClose,
    initialValues,
    initialStep = 1,
}: ObjectConnectionModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const [step, setStep] = useState(initialStep)

    const { data, queryKey: objectQueryKey, isFetching } = useObject()
    const { useGetRegulations, usePutRegulations } = model.fetchers

    const { refetch: refetchRegulations, queryKey } = useGetRegulations!(
        parseInt(objectId!),
        {
            query: { enabled: false },
        }
    )

    const { data: items, isLoading } = useRegulationsGet({
        query: { enabled: isOpen },
    })

    /**
     * Handle modal close
     */
    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    /**
     * Update step if initialStep has changed
     */
    useUpdateEffect(() => setStep(initialStep), [initialStep])

    const putRelations = usePutRegulations!({
        mutation: {
            onError: () => {
                toastNotification('error')
            },
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(queryKey),
                    queryClient.invalidateQueries(objectQueryKey),
                ])

                toastNotification('saved')
            },
        },
    })

    /**
     * Handle for submit
     */
    const handleFormSubmit = (payload: { items?: string[] }) => {
        const data = payload.items?.map(item => ({ UUID: item })) || []

        putRelations
            .mutateAsync({ lineageId: parseInt(objectId!), data })
            .then(handleClose)
    }

    /**
     * Handle delete connection
     */
    const handleDeleteConnection = (connection: RegulationObjectOverwrite) => {
        refetchRegulations().then(({ data, isSuccess }) => {
            if (isSuccess && !!data) {
                data.splice(
                    data.findIndex(item => item.UUID === connection.UUID),
                    1
                )

                putRelations.mutate({
                    lineageId: parseInt(objectId!),
                    data,
                })
            }
        })
    }

    /**
     * Format connections array
     */
    const connections = useMemo(() => {
        if (data && 'Regulations' in data) {
            return getPropertyByName(data, 'Regulations')
        }
    }, [data])

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 2

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Nationale belangen en Wettelijke taken"
            maxWidth="sm:max-w-[1200px]">
            {isFetching && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/20">
                    <LoaderSpinner />
                </div>
            )}
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    regulationConnection.SCHEMA
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <Heading level="2" className="mb-2">
                            Nationale belangen en Wettelijke taken
                        </Heading>
                        <CurrentStep
                            title={data?.Title}
                            setStep={setStep}
                            model={model}
                            connections={connections}
                            handleDeleteConnection={handleDeleteConnection}
                            items={items}
                            isLoading={isLoading}
                        />
                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            <Button
                                variant={isFinalStep ? 'cta' : 'primary'}
                                type="button"
                                isDisabled={
                                    (isFinalStep && !isValid) ||
                                    (isFinalStep && isSubmitting)
                                }
                                onPress={() => {
                                    !isFinalStep ? handleClose() : submitForm()
                                }}
                                isLoading={isSubmitting}>
                                {isFinalStep ? 'Opslaan' : 'Sluiten'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default RegulationModal
