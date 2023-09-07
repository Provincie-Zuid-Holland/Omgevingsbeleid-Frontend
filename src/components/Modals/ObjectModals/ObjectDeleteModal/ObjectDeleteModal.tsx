import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'

import {
    Button,
    FormikCheckbox,
    Heading,
    OLDModal as Modal,
    Text,
} from '@pzh-ui/components'

import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'
import { toastNotification } from '@/utils/toastNotification'

interface ObjectDeleteModalProps {
    object?: ModelReturnType
    model: Model
    isOpen: boolean
    onClose: () => void
}

const ObjectDeleteModal = ({
    object,
    model,
    isOpen,
    onClose,
}: ObjectDeleteModalProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { objectId } = useParams()

    const {
        singularCapitalize,
        singularReadable,
        demonstrative,
        demonstrativeSingular,
        plural,
    } = model.defaults
    const { useGetValid, useGetRelations, useDeleteObject } = model.fetchers

    const { queryKey } = useGetValid(undefined, { query: { enabled: false } })

    const { data: relations } = useGetRelations(parseInt(objectId!), {
        query: {
            enabled: !!objectId,
        },
    })

    const deleteObject = useDeleteObject?.({
        mutation: {
            onSuccess: () => {
                queryClient
                    .invalidateQueries(queryKey, {
                        refetchType: 'all',
                    })
                    .then(() => navigate(`/muteer/${plural}`))

                toastNotification('objectRemoved')
            },
        },
    })

    const handleDeletion = () =>
        deleteObject?.mutate({ lineageId: parseInt(objectId!) })

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel={`${singularCapitalize} verwijderen`}
            maxWidth="sm:max-w-[1200px]"
            closeButton>
            <Heading level="2" className="mb-4">
                {singularCapitalize} verwijderen
            </Heading>

            <div className="prose prose-neutral mb-4 max-w-full leading-6 text-pzh-blue-dark marker:text-pzh-blue-dark prose-li:my-0">
                <Text>
                    Weet je zeker dat je {singularReadable}:{' '}
                    <span className="font-bold">{object?.Title}</span> wilt
                    verwijderen?
                </Text>

                {!!relations?.length && (
                    <>
                        <Text className="my-0 first-letter:capitalize">
                            {demonstrative}{' '}
                            {demonstrativeSingular || singularReadable} is
                            gekoppeld aan de volgende objecten:
                        </Text>

                        <ul className="mb-4 mt-0">
                            {relations.map(relation => {
                                const model =
                                    models[relation.Object_Type as ModelType]

                                return (
                                    <Text
                                        as="li"
                                        key={
                                            relation.Object_Type +
                                            relation.Object_ID
                                        }>
                                        {model.defaults.singularCapitalize}:{' '}
                                        <Text as="span" bold>
                                            {relation.Title}
                                        </Text>
                                    </Text>
                                )
                            })}
                        </ul>
                    </>
                )}

                <Text className="mt-0">
                    Deze verwijderactie kan niet ongedaan gemaakt worden.
                </Text>
            </div>

            <Formik
                onSubmit={handleDeletion}
                initialValues={{ consent: false }}>
                {({ dirty, isSubmitting }) => (
                    <Form>
                        <FormikCheckbox name="consent">
                            Ik weet zeker dat ik {demonstrative}{' '}
                            {demonstrativeSingular || singularReadable} wil
                            verwijderen
                        </FormikCheckbox>

                        <div className="mt-6 flex items-center justify-between border-t border-pzh-gray-300 pt-5">
                            <Button variant="link" onPress={onClose}>
                                Annuleren
                            </Button>
                            <Button
                                type="submit"
                                variant="cta"
                                isDisabled={!dirty || isSubmitting}
                                isLoading={isSubmitting}>
                                {singularCapitalize} verwijderen
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default ObjectDeleteModal
