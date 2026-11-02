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
        modalState?.id,
        {
            query: {
                enabled: !!modalState?.publication.id && !!modalState?.id,
            },
        }
    )

    const { mutate } = usePublicationVersionsPostEditVersion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetListVersionsQueryKey(
                        modalState.publication.id
                    ),
                })
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetDetailVersionQueryKey(
                        modalState.id
                    ),
                })

                setActiveModal(null)
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersionEdit) => {
        const motivation = payload.bill_compact?.motivation

        const hasMotivation =
            hasValue(motivation?.title) ||
            hasValue(motivation?.content) ||
            !!motivation?.appendices?.length

        mutate({
            versionId: modalState.id,
            data: {
                ...payload,
                bill_compact: {
                    ...payload.bill_compact,
                    motivation: hasMotivation ? motivation : null,
                },
            },
        })
    }

    const initialValues = {
        ...data,
        effective_date:
            data?.publication.procedure_type === 'draft'
                ? null
                : (data?.effective_date ?? null),
        module_status_id: data?.module_status.id,
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
