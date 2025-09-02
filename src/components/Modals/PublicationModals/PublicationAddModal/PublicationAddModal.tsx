import { useQueryClient } from '@tanstack/react-query'

import {
    getPublicationsGetListPublicationsQueryKey,
    getPublicationVersionsGetListVersionsQueryKey,
    usePublicationsPostCreatePublication,
    usePublicationVersionsPostCreateVersion,
} from '@/api/fetchers'
import Modal from '@/components/Modal/Modal'
import PublicationForm from '@/components/Publications/PublicationForm'
import useModalStore from '@/store/modalStore'

import {
    EMPTY_PUBLICATION_OBJECT,
    PUBLICATION_ADD_SCHEMA,
    SCHEMA_PUBLICATION,
} from '@/validation/publication'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { ModalStateMap } from '../../types'

export type PublicationSchema = z.infer<typeof SCHEMA_PUBLICATION>

const PublicationAddModal = () => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const modalState = useModalStore(
        state => state.modalStates['publicationAdd']
    ) as ModalStateMap['publicationAdd']
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { mutateAsync: postPublication } =
        usePublicationsPostCreatePublication()
    const { mutateAsync: postVersion } =
        usePublicationVersionsPostCreateVersion()

    const initialValues: PublicationSchema = {
        ...EMPTY_PUBLICATION_OBJECT,
        Environment_UUID: modalState?.environmentUUID,
        Document_Type: modalState?.documentType,
        Procedure_Type: modalState?.procedureType,
        Module_ID: parseInt(String(moduleId)),
    }

    /**
     * Handle submit of contents form
     */
    const handleFormSubmit = ({
        Module_Status_ID,
        ...payload
    }: PublicationSchema) => {
        postPublication({ data: payload })
            .then(data => {
                postVersion({
                    publicationUuid: data.UUID,
                    data: {
                        Module_Status_ID,
                    },
                }).finally(() => {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationVersionsGetListVersionsQueryKey(
                            data.UUID
                        ),
                    })

                    setActiveModal(null)
                })
            })
            .finally(() => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsGetListPublicationsQueryKey({
                        module_id: parseInt(String(moduleId)),
                        limit: 100,
                    }),
                })
            })
    }

    return (
        <Modal id="publicationAdd" title="Instrument toevoegen" size="m">
            <PublicationForm
                type="add"
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    PUBLICATION_ADD_SCHEMA
                )}
                submitText="Toevoegen"
            />
        </Modal>
    )
}

export default PublicationAddModal
