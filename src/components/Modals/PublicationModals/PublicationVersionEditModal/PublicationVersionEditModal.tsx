import { useQueryClient } from '@tanstack/react-query'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import {
    getPublicationVersionsGetDetailVersionQueryKey,
    getPublicationVersionsGetListVersionsQueryKey,
    usePublicationVersionsGetDetailVersion,
    usePublicationVersionsPostEditVersion,
} from '@/api/fetchers'
import {
    PublicationVersion,
    PublicationVersionEdit,
} from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import Modal from '@/components/Modal/Modal'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import useModalStore from '@/store/modalStore'
import { PUBLICATION_VERSION_EDIT_SCHEMA } from '@/validation/publication'

import { ModalStateMap } from '../../types'

const hasValue = (value?: string | null) => !!value?.trim()

const PublicationVersionEditModal = () => {
    const queryClient = useQueryClient()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationVersionEdit']
    ) as ModalStateMap['publicationVersionEdit']

    const { data, isFetching } = usePublicationVersionsGetDetailVersion(
        modalState?.UUID,
        {
            query: {
                enabled: !!modalState?.publication.UUID && !!modalState?.UUID,
            },
        }
    )

    const { mutate } = usePublicationVersionsPostEditVersion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetListVersionsQueryKey(
                        modalState.publication.UUID
                    ),
                })
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetDetailVersionQueryKey(
                        modalState.UUID
                    ),
                })

                setActiveModal(null)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersionEdit) => {
        const motivation = payload.Bill_Compact?.Motivation

        const hasMotivation =
            hasValue(motivation?.Title) ||
            hasValue(motivation?.Content) ||
            !!motivation?.Appendices?.length

        mutate({
            versionUuid: modalState.UUID,
            data: {
                ...payload,
                Bill_Compact: {
                    ...payload.Bill_Compact,
                    Motivation: hasMotivation ? motivation : null,
                },
            },
        })
    }

    const initialValues = {
        ...data,
        Effective_Date:
            data?.Publication.Procedure_Type === 'draft'
                ? null
                : (data?.Effective_Date ?? null),
        Module_Status_ID: data?.Module_Status.ID,
    } as PublicationVersion

    return (
        <Modal id="publicationVersionEdit" title="Besluit">
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
                    isRequired={modalState?.isRequired}
                    readOnly={modalState?.readOnly}
                    error={modalState?.error}
                />
            )}
        </Modal>
    )
}

export default PublicationVersionEditModal
