import { formatDate } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'

import {
    getPublicationsPublicationUuidBillsBillUuidGetQueryKey,
    getPublicationsPublicationUuidBillsGetQueryKey,
    usePublicationsPublicationUuidBillsBillUuidGet,
    usePublicationsPublicationUuidBillsBillUuidPatch,
} from '@/api/fetchers'
import { PublicationBillEdit } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationVersionEditModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationVersionEdit']
    ) as ModalStateMap['publicationVersionEdit']

    const { data, isFetching } = usePublicationsPublicationUuidBillsBillUuidGet(
        modalState?.publication.UUID,
        modalState?.UUID,
        {
            query: {
                enabled: !!modalState?.publication.UUID && !!modalState?.UUID,
            },
        }
    )

    const { mutate } = usePublicationsPublicationUuidBillsBillUuidPatch({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsPublicationUuidBillsGetQueryKey(
                        modalState.publication.UUID
                    ),
                })
                queryClient.invalidateQueries({
                    queryKey:
                        getPublicationsPublicationUuidBillsBillUuidGetQueryKey(
                            modalState.publication.UUID,
                            modalState.UUID
                        ),
                })

                setActiveModal(null)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationBillEdit) => {
        payload.Effective_Date =
            payload.Effective_Date &&
            formatDate(new Date(payload.Effective_Date), 'yyyy-MM-dd')

        if (payload.Procedure_Data?.Announcement_Date) {
            payload.Procedure_Data.Announcement_Date =
                formatDate(
                    new Date(payload.Procedure_Data.Announcement_Date),
                    'yyyy-MM-dd'
                ) || ''
            payload.Announcement_Date =
                formatDate(
                    new Date(payload.Procedure_Data.Announcement_Date),
                    'yyyy-MM-dd'
                ) || ''
        }

        if (payload.Procedure_Data?.Steps?.[0]?.Conclusion_Date) {
            payload.Procedure_Data.Steps[0].Conclusion_Date = formatDate(
                new Date(payload.Procedure_Data.Steps[0].Conclusion_Date),
                'yyyy-MM-dd'
            )
        }

        if (payload.Procedure_Data?.Steps?.[1]?.Conclusion_Date) {
            payload.Procedure_Data.Steps[1].Conclusion_Date = formatDate(
                new Date(payload.Procedure_Data.Steps[1].Conclusion_Date),
                'yyyy-MM-dd'
            )
        }

        mutate({
            publicationUuid: modalState.publication.UUID,
            billUuid: modalState.UUID,
            data: payload,
        })
    }

    const initialValues = {
        ...data,
        Is_Official: data?.Is_Official ? 'true' : 'false',
    }

    return (
        <Modal id="publicationVersionEdit" title="Versie" size="xl">
            {isFetching ? (
                <div className="flex justify-center">
                    <LoaderSpinner />
                </div>
            ) : (
                <PublicationVersionForm
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    submitLabel="Versie opslaan"
                    isEdit
                />
            )}
        </Modal>
    )
}

export default PublicationVersionEditModal