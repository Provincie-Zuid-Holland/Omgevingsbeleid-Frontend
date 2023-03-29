import {
    Button,
    Divider,
    FormikTextArea,
    Heading,
    Modal,
    Text,
} from '@pzh-ui/components'
import { PenToSquare, TrashCan } from '@pzh-ui/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Formik, Form, useFormikContext } from 'formik'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateEffect } from 'react-use'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { RelationShort } from '@/api/fetchers.schemas'
import DynamicObjectSearch from '@/components/DynamicObject/DynamicObjectSearch'
import { Relation } from '@/components/DynamicObject/ObjectRelations/ObjectRelations'
import { LoaderSpinner } from '@/components/Loader'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import getPropertyByName from '@/utils/getPropertyByName'
import { toastNotification } from '@/utils/toastNotification'
import * as objectRelation from '@/validation/objectRelation'

import { ObjectModalActions } from '../types'

interface ObjectConnectionModalProps extends ObjectModalActions {
    model: Model
    onClose: () => void
    initialValues: RelationShort
    initialStep?: number
}

const ObjectConnectionModal = ({
    isOpen,
    onClose,
    initialValues,
    initialStep = 1,
    model,
    relationModel,
    connectionKey,
}: ObjectConnectionModalProps) => {
    const queryClient = useQueryClient()
    const { objectId } = useParams()

    const [step, setStep] = useState(initialStep)

    const { data, queryKey: objectQueryKey, isFetching } = useObject(model)
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
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(queryKey),
                    queryClient.invalidateQueries(objectQueryKey),
                ])

                toastNotification({ type: 'saved' })
            },
        },
    })

    /**
     * Handle for submit
     */
    const handleFormSubmit = (payload: RelationShort) => {
        refetchRelations().then(({ data, isSuccess }) => {
            if (isSuccess) {
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
     * Handle delete relation
     */
    const handleDeleteRelation = (relation: RelationShort) => {
        refetchRelations().then(({ data, isSuccess }) => {
            if (isSuccess) {
                data.splice(
                    data.findIndex(
                        item =>
                            item.Object_ID === relation.Object_ID &&
                            item.Object_Type === relation.Object_Type
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
     * Format relations array
     */
    const relations = useMemo(() => {
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
                {({ isValid, isSubmitting }) => (
                    <Form>
                        <Heading level="2" className="mb-2">
                            {relationModel?.defaults.singularCapitalize}{' '}
                            koppelen
                        </Heading>
                        <Wizard
                            step={step}
                            setStep={setStep}
                            model={model}
                            relationModel={relationModel}
                            handleDeleteRelation={handleDeleteRelation}
                            relations={relations}
                        />
                        <div className="mt-6 flex items-center justify-between">
                            <Button variant="link" onPress={handleClose}>
                                Annuleren
                            </Button>
                            {step !== 1 && (
                                <Button
                                    variant={isFinalStep ? 'cta' : 'primary'}
                                    type={isFinalStep ? 'submit' : 'button'}
                                    isDisabled={
                                        (isFinalStep && !isValid) ||
                                        (isFinalStep && isSubmitting)
                                    }
                                    onPress={
                                        !isFinalStep
                                            ? () => setStep(step + 1)
                                            : undefined
                                    }
                                    isLoading={isSubmitting}>
                                    {isFinalStep ? 'Opslaan' : 'Volgende'}
                                </Button>
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

const Wizard = ({
    model,
    relations,
    relationModel,
    step,
    setStep,
    handleDeleteRelation,
}: Pick<ObjectConnectionModalProps, 'relationModel' | 'model'> & {
    step: number
    setStep: (step: number) => void
    handleDeleteRelation: (relation: RelationShort) => void
    relations?: Relation[]
}) => {
    const { values, setFieldValue } = useFormikContext<
        RelationShort & { Title?: string }
    >()

    const { data, isLoading } = useObject(model)

    const { defaults } = relationModel || {}
    const {
        pluralCapitalize,
        plural,
        prefixNewObject,
        singular,
        prefixSingular,
    } = defaults || {}

    /**
     * Get amount of relations
     */
    const amount = useMemo(
        () => Object.values(relations || {}).length,
        [relations]
    )

    if (isLoading)
        return (
            <div className="flex justify-center mt-8">
                <LoaderSpinner />
            </div>
        )

    switch (step) {
        case 1:
            return (
                <>
                    <Text className="mb-4">
                        {pluralCapitalize} koppelen aan{' '}
                        {model.defaults.singular}:{' '}
                        <span className="font-bold">{data?.Title}</span>
                    </Text>
                    <Divider />
                    <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold">
                            {amount} Gekoppelde{' '}
                            {amount === 1 ? singular : plural}
                        </span>
                        <Button
                            size="small"
                            variant="cta"
                            type="button"
                            onPress={() => setStep(2)}>
                            {prefixNewObject} {singular} koppelen
                        </Button>
                    </div>

                    {amount > 0 && (
                        <>
                            {Array.isArray(relations) &&
                                relations.map(relation => (
                                    <Connection
                                        key={relation.UUID}
                                        setStep={setStep}
                                        handleDeleteRelation={
                                            handleDeleteRelation
                                        }
                                        {...relation}
                                    />
                                ))}
                        </>
                    )}
                </>
            )
        case 2:
            return (
                <>
                    <Text className="mb-4">
                        Selecteer {prefixSingular} {singular} waarmee je een
                        koppeling wilt maken vanuit {model.defaults.singular}:{' '}
                        <span className="font-bold">{data?.Title}</span>
                    </Text>
                    <DynamicObjectSearch
                        onChange={object =>
                            setFieldValue('Title', object?.Title)
                        }
                        objectKey="id"
                        placeholder={`Zoek in de ${plural}`}
                        label={pluralCapitalize}
                        styles={{
                            menu: base => ({
                                ...base,
                                position: 'relative',
                                zIndex: 9999,
                                marginTop: 0,
                                boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.10)',
                            }),
                        }}
                    />
                    <input name="Title" type="hidden" />
                </>
            )
        case 3:
            return (
                <>
                    <Text className="mb-4">
                        Leg uit waarom je {singular}:{' '}
                        <span className="font-bold">{values.Title}</span>
                        <br />
                        wilt koppelen aan {model.defaults.singular}:{' '}
                        <span className="font-bold">{data?.Title}</span>
                    </Text>
                    <FormikTextArea
                        name="Description"
                        placeholder="Beschrijving / Motivering van de koppeling"
                        label="Toelichting"
                        required
                    />
                </>
            )
        default:
            return <></>
    }
}

interface ConnectionProps extends RelationShort {
    Title?: string
    setStep: (step: number) => void
    handleDeleteRelation: (relation: RelationShort) => void
}

const Connection = ({
    Object_ID,
    Object_Type,
    Title,
    Description,
    setStep,
    handleDeleteRelation,
}: ConnectionProps) => {
    const { setFieldValue } = useFormikContext<RelationShort>()

    return (
        <div className="mt-3">
            <div className="px-3 pt-2 pb-1 flex justify-between items-center bg-pzh-gray-100 border border-pzh-gray-300 rounded-tl-[4px] rounded-tr-[4px]">
                <span className="font-bold">{Title}</span>
                <div className="flex items-center -mt-[4px]">
                    <button
                        className="mr-3"
                        onClick={() => {
                            setFieldValue('Title', Title)
                            setFieldValue('Description', Description)
                            setFieldValue('Object_ID', Object_ID)
                            setStep(3)
                        }}
                        aria-label="Wijzigen">
                        <PenToSquare size={16} className="text-pzh-green" />
                    </button>
                    <button
                        onClick={() =>
                            handleDeleteRelation({ Object_ID, Object_Type })
                        }
                        aria-label="Verwijderen">
                        <TrashCan size={16} className="text-pzh-red" />
                    </button>
                </div>
            </div>
            <div className="px-3 py-2 border border-t-0 border-pzh-gray-300 rounded-bl-[4px] rounded-br-[4px]">
                <Text>{Description}</Text>
            </div>
        </div>
    )
}

export default ObjectConnectionModal
