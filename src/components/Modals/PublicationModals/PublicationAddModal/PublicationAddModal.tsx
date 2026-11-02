import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

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
        environment_id: modalState?.environmentUUID,
        document_type: modalState?.documentType,
        procedure_type: modalState?.procedureType,
        module_id: parseInt(String(moduleId)),
    }

    /**
     * Handle submit of contents form
     */
    const handleFormSubmit = ({
        module_status_id,
        ...payload
    }: PublicationSchema) => {
        postPublication({
            data: { ...payload, act_id: Number(payload.act_id) },
        })
            .then(data => {
                postVersion({
                    publicationId: data.id,
                    data: {
                        module_status_id,
                    },
                }).finally(() => {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationVersionsGetListVersionsQueryKey(
                            data.id
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
        <Modal id="publicationAdd" title="Instrument aanmaken">
            <PublicationForm
                type="add"
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={toFormikValidationSchema(
                    PUBLICATION_ADD_SCHEMA
                )}
                submitText="Maak aan"
            />
        </Modal>
    )
}

export default PublicationAddModal
