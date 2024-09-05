import { useQueryClient } from '@tanstack/react-query'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationsPublicationUuidVersionPost,
} from '@/api/fetchers'
import { PublicationVersionCreate } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal/Modal'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import useModalStore from '@/store/modalStore'
import { PUBLICATION_VERSION_ADD_SCHEMA } from '@/validation/publication'

import { ModalStateMap } from '../../types'

const PublicationVersionAddModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationVersionAdd']
    ) as ModalStateMap['publicationVersionAdd']

    const { mutate } = usePublicationsPublicationUuidVersionPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsPublicationUuidVersionsGetQueryKey(
                        modalState.publication.UUID
                    ),
                })

                setActiveModal(null)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersionCreate) => {
        mutate({ publicationUuid: modalState.publication.UUID, data: payload })
    }

    return (
        <Modal id="publicationVersionAdd" title="Versie" size="xl">
            <PublicationVersionForm
                onSubmit={handleFormSubmit}
                initialValues={{} as PublicationVersionCreate}
                validationSchema={toFormikValidationSchema(
                    PUBLICATION_VERSION_ADD_SCHEMA
                )}
            />
        </Modal>
    )
}

export default PublicationVersionAddModal
