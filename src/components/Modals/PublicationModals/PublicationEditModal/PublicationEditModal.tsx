import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
    getPublicationsGetQueryKey,
    usePublicationsPublicationUuidGet,
    usePublicationsPublicationUuidPost,
} from '@/api/fetchers'
import { PublicationEdit } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import PublicationForm from '@/components/Publications/PublicationForm'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationEditModal = () => {
    const queryClient = useQueryClient()

    const { moduleId } = useParams()

    const modalState = useModalStore(
        state => state.modalStates['publicationEdit']
    ) as ModalStateMap['publicationEdit']
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data, isFetching, queryKey } = usePublicationsPublicationUuidGet(
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
                queryClient.invalidateQueries({ queryKey })
                queryClient.invalidateQueries({
                    queryKey: getPublicationsGetQueryKey({
                        module_id: parseInt(String(moduleId)),
                        limit: 100,
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
                />
            )}
        </Modal>
    )
}

export default PublicationEditModal
