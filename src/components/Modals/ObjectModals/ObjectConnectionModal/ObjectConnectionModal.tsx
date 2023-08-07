import { Button, Heading, Modal } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Formik, Form } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { ReadRelation, WriteRelation } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import { Model, ModelReturnType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import { toastNotification } from '@/utils/toastNotification'
import * as objectConnection from '@/validation/objectConnection'

import { StepOne, StepTwo, StepThree } from './steps'
import { ObjectConnectionModalActions } from '../types'

const steps = [StepOne, StepTwo, StepThree]

interface ObjectConnectionModalProps extends ObjectConnectionModalActions {
    model: Model
    onClose: () => void
}

const ObjectConnectionModal = ({
    onClose,
    initialValues,
    model,
    connectionModel,
    ...rest
}: ObjectConnectionModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const { data, queryKey: objectQueryKey, isFetching } = useObject()
    const { useGetRelations, usePutRelations } = model.fetchers

    const {
        data: relations,
        refetch: refetchRelations,
        queryKey,
    } = useGetRelations(parseInt(objectId!), { query: { enabled: !!objectId } })

    const putRelations = usePutRelations({
        mutation: {
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
    const handleFormSubmit = (
        payload:
            | WriteRelation
            | { items?: { Object_ID: number; Title: string }[] }
    ) => {
        refetchRelations().then(({ data, isSuccess }) => {
            if (isSuccess && !!data) {
                let newData = data as WriteRelation[]

                if (!('items' in payload)) {
                    if (!('Object_ID' in payload)) return

                    const isExisting = newData.find(
                        item =>
                            item.Object_ID === payload?.Object_ID &&
                            item.Object_Type === payload?.Object_Type
                    )

                    if (isExisting) {
                        isExisting.Description = payload?.Description || ''
                    } else {
                        if (payload?.Object_ID && payload.Object_Type) {
                            newData.push({
                                Object_ID: payload?.Object_ID,
                                Object_Type: payload?.Object_Type,
                                Description: payload?.Description || '',
                            })
                        }
                    }
                } else {
                    newData = [
                        ...newData.filter(
                            e =>
                                e.Object_Type !==
                                connectionModel?.defaults?.singular
                        ),
                        ...(payload.items?.map(item => ({
                            Object_ID: item.Object_ID,
                            Object_Type: connectionModel?.defaults?.singular,
                        })) || []),
                    ]
                }

                putRelations
                    .mutateAsync({
                        lineageId: parseInt(objectId!),
                        data: newData,
                    })
                    .then(onClose)
            }
        })
    }

    /**
     * Handle delete connection
     */
    const handleDeleteConnection = (connection: WriteRelation) => {
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

                putRelations
                    .mutateAsync({
                        lineageId: parseInt(objectId!),
                        data,
                    })
                    .then(() => {
                        if ('items' in initialValues) {
                            initialValues.items?.splice(
                                initialValues.items.findIndex(
                                    item =>
                                        item.Object_ID === connection.Object_ID
                                ),
                                1
                            )
                        }
                    })
            }
        })
    }

    return (
        <ConnectionModal
            model={model}
            initialValues={initialValues}
            connectionModel={connectionModel}
            data={data}
            handleFormSubmit={handleFormSubmit}
            handleDeleteConnection={handleDeleteConnection}
            isFetching={isFetching}
            relations={relations}
            onClose={onClose}
            {...rest}
        />
    )
}

interface ConnectionModalProps extends ObjectConnectionModalProps {
    isFetching?: boolean
    handleDeleteConnection: (connection: WriteRelation) => void
    handleFormSubmit: (
        payload:
            | WriteRelation
            | { items?: { Object_ID: number; Title: string }[] }
    ) => void
    relations?: ReadRelation[]
    data?: ModelReturnType
}

export const ConnectionModal = ({
    isOpen,
    onClose,
    isFetching,
    handleFormSubmit,
    initialValues,
    connectionModel,
    handleDeleteConnection,
    model,
    data,
    relations,
    connectionKey,
    initialStep = 1,
}: ConnectionModalProps) => {
    const [step, setStep] = useState(initialStep)

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === (connectionModel?.defaults?.atemporal ? 2 : 3)

    /**
     * Update step if initialStep has changed
     */
    useUpdateEffect(() => setStep(initialStep), [initialStep])

    /**
     * Update step if isOpen has changed
     */
    useUpdateEffect(() => {
        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }, [isOpen])

    /**
     * Handle modal close
     */
    const handleClose = () => {
        onClose()

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            ariaLabel="Nieuwe koppeling"
            maxWidth="sm:max-w-[1200px]"
            closeButton>
            {isFetching && (
                <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/20">
                    <LoaderSpinner />
                </div>
            )}
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    objectConnection.SCHEMA
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
                            connections={relations?.filter(
                                relation =>
                                    relation.Object_Type === connectionKey
                            )}
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
                                        onPress={() => setStep(step - 1)}
                                        className="mr-3">
                                        Vorige stap
                                    </Button>
                                    <Button
                                        variant={
                                            isFinalStep ? 'cta' : 'primary'
                                        }
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
