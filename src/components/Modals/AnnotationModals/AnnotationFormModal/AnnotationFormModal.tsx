import { useMemo, useState } from 'react'

import { Button, FieldCheckbox } from '@pzh-ui/components'

import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { Form, Formik, FormikHelpers } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { HTTPValidationError } from '@/api/fetchers.schemas'
import DynamicField from '@/components/DynamicObject/DynamicObjectForm/DynamicField'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import { Annotation } from '@/config/annotations/types'
import useModalStore from '@/store/modalStore'
import handleError from '@/utils/handleError'
import { toastNotification } from '@/utils/toastNotification'

type FormData = Record<string, unknown>

interface AnnotationFormModalProps {
    annotation: Annotation
    annotationId: string | null
    onSaved: () => void
}

const AnnotationFormModal = ({
    annotation,
    annotationId,
    onSaved,
}: AnnotationFormModalProps) => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [deleteConfirmed, setDeleteConfirmed] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const editing = !!annotationId
    const { singularCapitalize } = annotation.defaults

    const detailQuery = annotation.api.useDetail(annotationId || '', editing)
    const create = annotation.api.useCreate()
    const edit = annotation.api.useEdit()
    const remove = annotation.api.useDelete()

    const initialValues = useMemo(
        () =>
            annotation.dynamicSections
                .flatMap(section => section.fields)
                .reduce<FormData>((values, field) => {
                    values[String(field.name)] =
                        detailQuery.data?.[String(field.name)] ?? ''
                    return values
                }, {}),
        [annotation.dynamicSections, detailQuery.data]
    )

    const close = () => {
        setActiveModal(null)
        setDeleteConfirmed(false)
    }

    const handleDelete = async () => {
        if (!annotationId || !deleteConfirmed) return

        setIsDeleting(true)

        try {
            await remove.remove(annotationId)
            await queryClient.invalidateQueries({
                queryKey: annotation.api.overviewQueryKey,
                refetchType: 'all',
            })
            onSaved()
            close()
            toastNotification('annotationDeleted')
        } catch {
            toastNotification('error')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleSubmit = async (
        values: FormData,
        helpers: FormikHelpers<FormData>
    ) => {
        try {
            if (annotationId) {
                await edit.save(annotationId, values)
            } else {
                await create.save(values)
            }

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: annotation.api.overviewQueryKey,
                    refetchType: 'all',
                }),
                ...(annotationId && detailQuery.queryKey
                    ? [
                          queryClient.invalidateQueries({
                              queryKey: detailQuery.queryKey,
                              refetchType: 'all',
                          }),
                      ]
                    : []),
            ])
            onSaved()
            close()
            toastNotification('saved')
        } catch (error) {
            const response = (error as AxiosError<HTTPValidationError>).response

            if (response) {
                handleError<FormData>(response, helpers)
            } else {
                helpers.setSubmitting(false)
                toastNotification('error')
            }
        }
    }

    return (
        <Modal
            id="annotationForm"
            title={
                editing
                    ? `${singularCapitalize} bewerken`
                    : `Nieuwe ${singularCapitalize.toLowerCase()} aanmaken`
            }
            onClose={close}>
            {editing && detailQuery.isFetching ? (
                <div className="flex justify-center py-8">
                    <LoaderSpinner />
                </div>
            ) : (
                <Formik
                    initialValues={initialValues}
                    validationSchema={
                        annotation.validationSchema &&
                        toFormikValidationSchema(annotation.validationSchema)
                    }
                    validateOnMount
                    enableReinitialize
                    onSubmit={handleSubmit}>
                    {({ dirty, isSubmitting, isValid }) => (
                        <Form noValidate>
                            {annotation.dynamicSections.flatMap(section =>
                                section.fields.map((field, index) => (
                                    <DynamicField
                                        key={`${String(field.name)}-${field.type}`}
                                        isFirst={index === 0}
                                        className={
                                            index !== 0 ? 'mt-4' : undefined
                                        }
                                        {...field}
                                    />
                                ))
                            )}

                            {editing && (
                                <FieldCheckbox
                                    className="mt-4"
                                    checked={deleteConfirmed}
                                    onChange={event =>
                                        setDeleteConfirmed(event.target.checked)
                                    }>
                                    Ik wil de {singularCapitalize.toLowerCase()}{' '}
                                    verwijderen
                                </FieldCheckbox>
                            )}

                            <ModalFooter className="mt-4">
                                <Button variant="link" onPress={close}>
                                    Annuleren
                                </Button>
                                <div className="ml-auto flex items-center gap-4">
                                    {editing && (
                                        <Button
                                            type="button"
                                            isDisabled={
                                                !deleteConfirmed ||
                                                isDeleting ||
                                                isSubmitting
                                            }
                                            isLoading={isDeleting}
                                            onPress={handleDelete}>
                                            {singularCapitalize} verwijderen
                                        </Button>
                                    )}
                                    <Button
                                        type="submit"
                                        variant="cta"
                                        isDisabled={
                                            !isValid ||
                                            isSubmitting ||
                                            isDeleting ||
                                            !dirty
                                        }
                                        isLoading={isSubmitting}>
                                        {editing ? 'Opslaan' : 'Maak aan'}
                                    </Button>
                                </div>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    )
}

export default AnnotationFormModal
