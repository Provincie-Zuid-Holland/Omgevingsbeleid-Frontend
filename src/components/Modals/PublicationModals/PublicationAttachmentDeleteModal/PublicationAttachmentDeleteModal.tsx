import {
    getPublicationVersionsGetListAttachmentsQueryKey,
    usePublicationVersionsPostDeleteAttachment,
} from '@/api/fetchers'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'
import { Button, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { ModalStateMap } from '../../types'

const PublicationAttachmentDeleteModal = () => {
    const queryClient = useQueryClient()
    const { versionUUID } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationAttachmentDelete']
    ) as ModalStateMap['publicationAttachmentDelete']

    const { mutate, isPending, isError } =
        usePublicationVersionsPostDeleteAttachment({
            mutation: {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries({
                            queryKey:
                                getPublicationVersionsGetListAttachmentsQueryKey(
                                    String(versionUUID)
                                ),
                        })
                        .finally(() => {
                            toastNotification('publicationAttachmentDeleted')
                            setActiveModal(null)
                        })
                },
            },
        })

    return (
        <Modal
            id="publicationAttachmentDelete"
            title="Document verwijderen"
            description={
                <Text>
                    Weet je zeker dat je{' '}
                    <Text as="span" bold>
                        {modalState?.attachment?.Title}
                    </Text>{' '}
                    wil verwijderen?
                </Text>
            }
            size="s">
            <ModalFooter className="mt-4">
                <Button
                    variant="link"
                    type="button"
                    onPress={() => setActiveModal(null)}
                    className="text-pzh-blue-500 mr-3">
                    Annuleren
                </Button>
                <Button
                    type="submit"
                    isDisabled={isPending && !isError}
                    isLoading={isPending && !isError}
                    onPress={() =>
                        mutate({
                            versionUuid: String(versionUUID),
                            attachmentId: modalState?.attachment.ID,
                        })
                    }>
                    Verwijderen
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default PublicationAttachmentDeleteModal
