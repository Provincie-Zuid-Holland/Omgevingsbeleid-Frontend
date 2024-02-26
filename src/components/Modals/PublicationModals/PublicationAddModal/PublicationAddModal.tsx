import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { getPublicationsGetQueryKey, usePublicationsPost } from '@/api/fetchers'
import { PublicationCreate } from '@/api/fetchers.schemas'
import Modal from '@/components/Modal/Modal'
import PublicationForm from '@/components/Publications/PublicationForm'
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

    const handleFormSubmit = (payload: PublicationCreate) => {
        mutate({ data: payload })
    }

    return (
        <Modal id="publicationAdd" title="Publicatie" size="xl">
            <PublicationForm
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                submitLabel="Publicatie aanmaken"
            />
        </Modal>
    )
}

export default PublicationAddModal
