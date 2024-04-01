import { useQueryClient } from '@tanstack/react-query'

import {
    getPublicationsGetQueryKey,
    usePublicationsPublicationUuidGet,
    usePublicationsPublicationUuidPost,
} from '@/api/fetchers'
import { DocumentType, PublicationEdit } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import PublicationForm from '@/components/Publications/PublicationForm'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationEditModal = () => {
    const queryClient = useQueryClient()

    const modalState = useModalStore(
        state => state.modalStates['publicationEdit']
    ) as ModalStateMap['publicationEdit']
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, isFetching } = usePublicationsPublicationUuidGet(
        modalState?.publication.UUID,
        {
            query: {
                enabled: !!modalState?.publication.UUID,
            },
        }
    )

    const { mutate } = usePublicationsPublicationUuidPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsGetQueryKey({
                        document_type: modalState.publication
                            .Document_Type as DocumentType,
                    }),
                })

                setActiveModal(null)
            },
        },
    })

    const initialValues = {
        ...data,
    } as PublicationEdit

    const handleFormSubmit = (payload: PublicationEdit) => {
        mutate({ publicationUuid: modalState?.publication.UUID, data: payload })
    }

    return (
        <Modal id="publicationEdit" title="Publicatie" size="xl">
            {isFetching ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <PublicationForm
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    submitLabel="Publicatie opslaan"
                />
            )}
        </Modal>
    )
}

export default PublicationEditModal
