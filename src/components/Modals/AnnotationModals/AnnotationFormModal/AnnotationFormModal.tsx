import { useMemo } from 'react'

import { Button } from '@pzh-ui/components'

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
    const editing = !!annotationId
    const { singularCapitalize } = annotation.defaults
    const detailQuery = annotation.api.useDetail(annotationId || '', editing)
    const create = annotation.api.useCreate()
    const edit = annotation.api.useEdit()

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

    const close = () => setActiveModal(null)

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

                            <ModalFooter className="mt-4">
                                <Button variant="link" onPress={close}>
                                    Annuleren
                                </Button>
                                <Button
                                    type="submit"
                                    variant="cta"
                                    isDisabled={
                                        !isValid || isSubmitting || !dirty
                                    }
                                    isLoading={isSubmitting}>
                                    {editing ? 'Opslaan' : 'Maak aan'}
                                </Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            )}
        </Modal>
    )
}

export default AnnotationFormModal
