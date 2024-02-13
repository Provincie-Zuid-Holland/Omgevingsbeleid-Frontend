import { Button, Divider, FormikInput, FormikSelect } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { Form, Formik } from 'formik'
import { useParams } from 'react-router-dom'

import { getPublicationsGetQueryKey, usePublicationsPost } from '@/api/fetchers'
import {
    AppExtensionsPublicationsEnumsDocumentType,
    PublicationCreate,
} from '@/api/fetchers.schemas'
import Modal from '@/components/Modal/Modal'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationAddModal = () => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const modalState = useModalStore(
        state => state.modalStates['publicationAdd']
    ) as ModalStateMap['publicationAdd']
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { mutate } = usePublicationsPost({
        mutation: {
            onSuccess: data => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsGetQueryKey({
                        document_type: data.Document_Type,
                    }),
                })

                setActiveModal(null)
            },
        },
    })

    const initialValues = {
        Module_ID: parseInt(moduleId!),
        Document_Type: modalState?.type,
    } as PublicationCreate

    const options = (
        Object.keys(
            AppExtensionsPublicationsEnumsDocumentType
        ) as Array<AppExtensionsPublicationsEnumsDocumentType>
    ).map(type => ({ label: type, value: type }))

    const handleFormSubmit = (payload: PublicationCreate) => {
        mutate({ data: payload })
    }

    return (
        <Modal id="publicationAdd" title="Publicatie" size="xl">
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                enableReinitialize>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="space-y-4">
                            <FormikSelect
                                name="Document_Type"
                                label="Instrument"
                                options={options}
                                disabled
                            />
                            <FormikInput
                                name="Official_Title"
                                label="Officiële titel"
                                placeholder="Vul de officiële titel in"
                            />
                            <FormikInput
                                name="Regulation_Title"
                                label="Regeling opschrift"
                                placeholder="Regeling opschrift"
                            />
                            <FormikSelect
                                name="Template_ID"
                                label="Publicatie template"
                            />
                        </div>
                        <Divider className="my-6" />
                        <div className="flex items-center justify-between">
                            <Button
                                variant="link"
                                onPress={() => setActiveModal(null)}>
                                Annuleren
                            </Button>
                            <Button
                                variant="cta"
                                type="submit"
                                isLoading={isSubmitting}>
                                Publicatie opslaan
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}

export default PublicationAddModal
