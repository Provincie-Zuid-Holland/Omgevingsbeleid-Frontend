import { Button } from '@pzh-ui/components'
import { useUpdateEffect } from '@react-hookz/web'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { ReadRelation, WriteRelation } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import { Model, ModelReturnType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import * as objectConnection from '@/validation/objectConnection'

import { ModalFooter } from '@/components/Modal/Modal'
import { StepFour, StepOne, StepThree, StepTwo } from './steps'

const steps = [StepOne, StepTwo, StepThree, StepFour]

interface ObjectConnectionModalProps extends ObjectConnectionModalActions {
    model: Model
}

const ObjectConnectionModal = ({
    initialValues,
    model,
    connectionModel,
    ...rest
}: ObjectConnectionModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, queryKey: objectQueryKey, isFetching } = useObject()
    const { useGetRelations, usePutRelations } = model.fetchers

    const {
        data: relations,
        refetch: refetchRelations,
        queryKey,
    } = useGetRelations?.(parseInt(objectId!), {
        query: { enabled: !!objectId },
    }) || {}

    const { mutateAsync } =
        usePutRelations?.({
            mutation: {
                onSuccess: () => {
                    Promise.all([
                        queryClient.invalidateQueries({ queryKey }),
                        queryClient.invalidateQueries({
                            queryKey: objectQueryKey,
                        }),
                    ])

                    toastNotification('saved')
                },
            },
        }) || {}

    /**
     * Handle for submit
     */
    const handleFormSubmit = (
        payload: WriteRelation | { items?: { value: number; label: string }[] }
    ) => {
        refetchRelations?.().then(({ data, isSuccess }) => {
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
                            Object_ID: item.value,
                            Object_Type: connectionModel?.defaults?.singular,
                        })) || []),
                    ]
                }

                mutateAsync?.({
                    lineageId: parseInt(objectId!),
                    data: newData,
                }).then(() => setActiveModal(null))
            }
        })
    }

    /**
     * Handle delete connection
     */
    const handleDeleteConnection = (connection: WriteRelation) => {
        refetchRelations?.().then(({ data, isSuccess }) => {
            if (isSuccess && !!data) {
                data.splice(
                    data.findIndex(
                        item =>
                            item.Object_ID === connection.Object_ID &&
                            item.Object_Type === connection.Object_Type
                    ),
                    1
                )

                mutateAsync?.({
                    lineageId: parseInt(objectId!),
                    data,
                }).then(() => {
                    if ('items' in initialValues) {
                        initialValues.items?.splice(
                            initialValues.items.findIndex(
                                item => item.value === connection.Object_ID
                            ),
                            1
                        )
                    }

                    setActiveModal(null)
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
            {...rest}
        />
    )
}

type ConnectionPayload =
    | WriteRelation
    | { items?: { value: number; label: string }[] }

interface ConnectionModalProps extends ObjectConnectionModalProps {
    isFetching?: boolean
    handleDeleteConnection: (connection: WriteRelation) => void
    handleFormSubmit: (payload: ConnectionPayload) => void
    relations?: ReadRelation[]
    data?: ModelReturnType
}

export const ConnectionModal = ({
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
    const activeModal = useModalStore(state => state.activeModal)
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [step, setStep] = useState(initialStep)

    const CurrentStep = steps[step - 1]
    const isFinalStep = step === (connectionModel?.defaults?.atemporal ? 2 : 3)
    const isDeleteStep = step === 4
    const currentValidationSchema =
        objectConnection.SCHEMA_CONNECTION_STEPS[step - 1]

    /**
     * Update step if initialStep has changed
     */
    useUpdateEffect(() => setStep(initialStep), [initialStep])

    /**
     * Update step if activeModal has changed
     */
    useUpdateEffect(() => {
        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }, [activeModal === 'objectAddConnection'])

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setActiveModal(null)

        // Wait for modal animation to finish before resetting step
        setTimeout(() => setStep(initialStep), 300)
    }

    const handleSubmit = (
        payload: ConnectionPayload,
        helpers: FormikHelpers<ConnectionPayload>
    ) => {
        if (isFinalStep) {
            handleFormSubmit(payload)
        } else if (isDeleteStep && 'Object_ID' in payload) {
            handleDeleteConnection(payload)
        } else {
            setStep(step + 1)
            helpers.setTouched({})
            helpers.setSubmitting(false)
        }
    }

    return (
        <Modal
            id="objectAddConnection"
            title={`${connectionModel?.defaults?.singularCapitalize} koppelen`}
            hideTitle
            onClose={handleClose}>
            {isFetching && (
                <div className="bg-pzh-black/20 absolute top-0 left-0 flex h-full w-full items-center justify-center">
                    <LoaderSpinner />
                </div>
            )}
            <Formik
                onSubmit={handleSubmit}
                initialValues={
                    initialValues as ConnectionPayload & { type?: 'edit' }
                }
                validationSchema={toFormikValidationSchema(
                    currentValidationSchema
                )}
                enableReinitialize>
                {({ isValid, isSubmitting, submitForm, values }) => (
                    <Form onSubmit={e => e.preventDefault()}>
                        <CurrentStep
                            title={data?.Title}
                            connectionModel={connectionModel}
                            model={model}
                            connections={relations?.filter(
                                relation =>
                                    relation.Object_Type === connectionKey
                            )}
                            setStep={setStep}
                        />
                        <ModalFooter className="mt-4">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            {step !== 1 && (
                                <div>
                                    {!isDeleteStep &&
                                        values.type !== 'edit' &&
                                        !(
                                            initialStep === 2 &&
                                            (!isFinalStep ||
                                                connectionModel?.defaults
                                                    ?.atemporal)
                                        ) && (
                                            <Button
                                                variant="secondary"
                                                type="button"
                                                size="small"
                                                onPress={() =>
                                                    setStep(step - 1)
                                                }
                                                className="mr-3">
                                                Vorige stap
                                            </Button>
                                        )}
                                    <Button
                                        variant={
                                            isFinalStep || isDeleteStep
                                                ? 'cta'
                                                : 'primary'
                                        }
                                        size="small"
                                        isDisabled={
                                            (isFinalStep && !isValid) ||
                                            ((isFinalStep || isDeleteStep) &&
                                                isSubmitting)
                                        }
                                        onPress={submitForm}
                                        isLoading={isSubmitting}>
                                        {isFinalStep
                                            ? 'Opslaan'
                                            : isDeleteStep
                                              ? 'Koppeling verbreken'
                                              : 'Volgende stap'}
                                    </Button>
                                </div>
                            )}
                        </ModalFooter>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectConnectionModal
