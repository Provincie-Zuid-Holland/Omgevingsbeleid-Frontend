import {
    Button,
    Divider,
    FieldLabel,
    FormikCheckbox,
    Heading,
    Text,
} from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik, FormikHelpers } from 'formik'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import DynamicObjectForm from '@/components/DynamicObject/DynamicObjectForm'
import * as models from '@/config/objects'
import { ModelType } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'
import MutateLayout from '@/templates/MutateLayout'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectWriteProps {
    model: (typeof models)[ModelType]
}

const ObjectWrite = ({ model }: ObjectWriteProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { objectId } = useParams()

    const {
        singularCapitalize,
        singularReadable,
        plural,
        pluralCapitalize,
        demonstrative,
    } = model.defaults
    const {
        useDeleteObject,
        usePatchObject,
        useGetLatestLineage,
        useGetValid,
        useGetRelations,
        usePutRelations,
    } = model.fetchers

    const { data, isLoading, queryKey } = useGetLatestLineage?.(
        parseInt(objectId!),
        {
            query: { enabled: !!objectId },
        }
    )

    const { data: relations, queryKey: relationsQueryKey } =
        useGetRelations?.(parseInt(objectId!), {
            query: { enabled: !!objectId },
        }) || {}

    const { queryKey: validQueryKey } = useGetValid(undefined, {
        query: { enabled: false },
    })

    const writeObject = usePatchObject?.()
    const putRelations = usePutRelations?.()

    /**
     * Format initialData based on object fields
     */
    const initialData = useMemo(() => {
        const fields = model.dynamicSections.flatMap(section =>
            section.fields.map(field => field.name)
        )

        const objectData = {} as { [key in (typeof fields)[number]]: any }

        fields?.forEach(field => {
            if (field === 'connections') {
                return (objectData[field] = relations)
            }

            return (objectData[field] = data?.[field as keyof typeof data])
        })

        return objectData
    }, [data, model.dynamicSections, relations])

    /**
     * Handle submit of form
     */
    const handleSubmit = (
        payload: typeof initialData,
        helpers: FormikHelpers<typeof initialData>
    ) => {
        if (!payload) return

        const { connections, ...rest } = payload

        writeObject
            ?.mutateAsync(
                {
                    lineageId: parseInt(objectId!),
                    data: rest,
                },
                {
                    onSuccess: () => {
                        if (!!connections) {
                            putRelations?.mutateAsync(
                                {
                                    lineageId: parseInt(objectId!),
                                    data: connections,
                                },
                                {
                                    onSuccess: () => {
                                        Promise.all([
                                            queryClient.invalidateQueries({
                                                queryKey,
                                            }),
                                            queryClient.invalidateQueries({
                                                queryKey: validQueryKey,
                                            }),
                                            queryClient.invalidateQueries({
                                                queryKey: relationsQueryKey,
                                            }),
                                        ]).then(() =>
                                            navigate(`/muteer/${plural}`)
                                        )

                                        toastNotification('saved')
                                    },
                                }
                            )
                        } else {
                            Promise.all([
                                queryClient.invalidateQueries({ queryKey }),
                                queryClient.invalidateQueries({
                                    queryKey: validQueryKey,
                                }),
                            ]).then(() => navigate(`/muteer/${plural}`))

                            toastNotification('saved')
                        }
                    },
                }
            )
            .catch(err =>
                handleError<typeof initialData>(err.response, helpers)
            )
    }

    const deleteObject = useDeleteObject?.({
        mutation: {
            onSuccess: () => {
                queryClient
                    .invalidateQueries({
                        queryKey: validQueryKey,
                        refetchType: 'all',
                    })
                    .then(() => navigate(`/muteer/${plural}`))

                toastNotification('objectRemoved')
            },
        },
    })

    const handleDeletion = () =>
        deleteObject?.mutate({ lineageId: parseInt(objectId!) })

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        {
            name: pluralCapitalize,
            path: `/muteer/${plural}`,
        },
        { name: `${singularCapitalize} bewerken`, isCurrent: true },
    ]

    return (
        <MutateLayout
            title={`${singularCapitalize} bewerken`}
            breadcrumbs={breadcrumbPaths}>
            <div className="col-span-6">
                <div className="mb-8 flex flex-wrap justify-between gap-2 align-middle">
                    <Heading level="1" size="xxl">
                        {singularCapitalize} bewerken
                    </Heading>
                </div>

                <DynamicObjectForm
                    model={model}
                    initialData={initialData}
                    handleSubmit={handleSubmit}
                    onCancel={() => navigate(`/muteer/${plural}`)}
                    isLoading={isLoading}
                />

                <div className="grid grid-cols-6 gap-x-10 gap-y-0">
                    <div className="col-span-6 my-6">
                        <Divider />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <Heading level="2" size="m" className="mb-3">
                            {singularCapitalize} verwijderen
                        </Heading>
                        <Text>
                            Verwijder {demonstrative} {singularReadable}.
                        </Text>
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                        <Formik
                            onSubmit={handleDeletion}
                            initialValues={{ consent: false }}>
                            {({ dirty, isSubmitting }) => (
                                <Form>
                                    <FieldLabel
                                        name="consent"
                                        label={`Let op! Het verwijderen van ${demonstrative} ${singularReadable} is niet terug te draaien`}
                                    />
                                    <FormikCheckbox
                                        name="consent"
                                        className="block">
                                        Ik wil {demonstrative}{' '}
                                        {singularReadable} voorgoed verwijderen
                                    </FormikCheckbox>
                                    <Button
                                        type="submit"
                                        isDisabled={!dirty || isSubmitting}
                                        isLoading={isSubmitting}
                                        className="mt-4">
                                        {singularCapitalize} verwijderen
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </MutateLayout>
    )
}

export default ObjectWrite
