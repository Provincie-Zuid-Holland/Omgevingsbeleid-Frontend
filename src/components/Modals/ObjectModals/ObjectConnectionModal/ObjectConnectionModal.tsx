import { Button, Heading, Modal } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { RelationShort } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import getPropertyByName from '@/utils/getPropertyByName'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { ObjectConnectionModalActions } from '../types'
import { StepOne, StepTwo, StepThree } from './steps'

const steps = [StepOne, StepTwo, StepThree]

interface ObjectConnectionModalProps extends ObjectConnectionModalActions {
    model: Model
    onClose: () => void
}

const ObjectConnectionModal = ({
    isOpen,
    onClose,
    initialValues,
    initialStep = 1,
    model,
    connectionModel,
    connectionKey,
}: ObjectConnectionModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const [step, setStep] = useState(initialStep)

    const { data, queryKey: objectQueryKey, isFetching } = useObject()
    const { useGetRelations, usePutRelations } = model.fetchers

    const { refetch: refetchRelations, queryKey } = useGetRelations(
        parseInt(objectId!),
        {
            query: { enabled: false },
        }
    )

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

    const putRelations = usePutRelations({
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
    const handleFormSubmit = (payload: RelationShort) => {
        refetchRelations().then(({ data, isSuccess }) => {
            if (isSuccess && !!data) {
                const isExisting = data.find(
                    item =>
                        item.Object_ID === payload?.Object_ID &&
                        item.Object_Type === payload?.Object_Type
                )

                if (isExisting) {
                    isExisting.Description = payload?.Description
                } else {
                    if (payload?.Object_ID && payload.Object_Type) {
                        data.push({
                            Object_ID: payload?.Object_ID,
                            Object_Type: payload?.Object_Type,
                            Description: payload?.Description,
                        })
                    }
                }

                putRelations
                    .mutateAsync({ lineageId: parseInt(objectId!), data })
                    .then(handleClose)
            }
        })
    }

    /**
     * Handle delete connection
     */
    const handleDeleteConnection = (connection: RelationShort) => {
        refetchRelations().then(({ data, isSuccess }) => {
            if (isSuccess && !!data) {
                data.splice(
                    data.findIndex(
                        item =>
                            item.Object_ID === connection.Object_ID &&
                            item.Object_Type === connection.Object_Type
                    ),
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
        if (data && connectionKey && connectionKey in data) {
            const propertyType = getPropertyByName(data, connectionKey)

            if (Array.isArray(propertyType)) {
                return propertyType.map(({ Object, Relation }) => ({
                    ...Object,
                    Object_ID: Object.Object_ID || 0,
                    Object_Type: Object.Object_Type || '',
                    Description: Relation.Description,
                }))
            }
        }
    }, [data, connectionKey])

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === 3

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Nieuwe koppeling"
            maxWidth="sm:max-w-[812px]">
            {isFetching && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/20">
                    <LoaderSpinner />
                </div>
            )}
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectRelation.SCHEMA
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm }) => (
                    <Form>
                        <Heading level="2" className="mb-2">
                            {connectionModel?.defaults.singularCapitalize}{' '}
                            koppelen
                        </Heading>
                        <CurrentStep
                            title={data?.Title}
                            connectionModel={connectionModel}
                            model={model}
                            connections={connections}
                            setStep={setStep}
                            handleDeleteConnection={handleDeleteConnection}
                        />
                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            {step !== 1 && (
                                <div>
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        size="small"
                                        onPress={() => setStep(step - 1)}
                                        className="mr-3">
                                        Vorige stap
                                    </Button>
                                    <Button
                                        variant={
                                            isFinalStep ? 'cta' : 'primary'
                                        }
                                        type="button"
                                        size="small"
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
                                            ? 'Opslaan'
                                            : 'Volgende stap'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectConnectionModal
