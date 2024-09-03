import { useQueryClient } from '@tanstack/react-query'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getPublicationVersionsVersionUuidGetQueryKey,
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationVersionsVersionUuidGet,
    usePublicationVersionsVersionUuidPost,
} from '@/api/fetchers'
import { PublicationVersionEdit } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import useModalStore from '@/store/modalStore'
import { PUBLICATION_VERSION_EDIT_SCHEMA } from '@/validation/publication'

import { ModalStateMap } from '../../types'

const PublicationVersionEditModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationVersionEdit']
    ) as ModalStateMap['publicationVersionEdit']

    const { data, isFetching } = usePublicationVersionsVersionUuidGet(
        modalState?.UUID,
        {
            query: {
                enabled: !!modalState?.publication.UUID && !!modalState?.UUID,
            },
        }
    )

    const { mutate } = usePublicationVersionsVersionUuidPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationsPublicationUuidVersionsGetQueryKey(
                        modalState.publication.UUID
                    ),
                })
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsVersionUuidGetQueryKey(
                        modalState.UUID
                    ),
                })

                setActiveModal(null)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersionEdit) => {
        if (payload.Announcement_Date && payload.Procedural) {
            payload.Procedural.Procedural_Announcement_Date =
                payload.Announcement_Date
        }

        mutate({
            versionUuid: modalState.UUID,
            data: payload,
        })
    }

    const initialValues = {
        ...data,
        Module_Status_ID: data?.Module_Status.ID,
    } as PublicationVersionEdit

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
                    validationSchema={toFormikValidationSchema(
                        PUBLICATION_VERSION_EDIT_SCHEMA
                    )}
                />
            )}
        </Modal>
    )
}

export default PublicationVersionEditModal
