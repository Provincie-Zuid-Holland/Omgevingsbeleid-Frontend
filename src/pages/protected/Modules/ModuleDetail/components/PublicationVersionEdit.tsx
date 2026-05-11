import {
    getPublicationVersionsGetDetailVersionQueryKey,
    getPublicationVersionsGetListVersionsQueryKey,
    usePublicationVersionsGetDetailVersion,
    usePublicationVersionsPostEditVersion,
} from '@/api/fetchers'
import { PublicationVersion } from '@/api/fetchers.schemas'
import { LoaderSpinner } from '@/components/Loader'
import {
    PublicationAttachmentAddModal,
    PublicationAttachmentDeleteModal,
} from '@/components/Modals/PublicationModals'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import { PUBLICATION_VERSION_EDIT_SCHEMA } from '@/validation/publication'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const PublicationVersionEdit = () => {
    const { versionUUID } = useParams()

    const queryClient = useQueryClient()

    const { data, isFetching } = usePublicationVersionsGetDetailVersion(
        String(versionUUID),
        {
            query: {
                enabled: !!versionUUID,
            },
        }
    )

    const { mutate } = usePublicationVersionsPostEditVersion({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetListVersionsQueryKey(
                        String(data?.Publication.UUID)
                    ),
                })
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetDetailVersionQueryKey(
                        String(versionUUID)
                    ),
                })
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersion) =>
        mutate({
            versionUuid: String(versionUUID),
            data: payload,
        })

    const initialValues = {
        ...data,
        Module_Status_ID: data?.Module_Status.ID,
    } as PublicationVersion

    if (isFetching) return <LoaderSpinner />

    return (
        <>
            <div className="grid grid-cols-6">
                <div className="col-span-4 col-start-2">
                    <PublicationVersionForm
                        onSubmit={handleFormSubmit}
                        initialValues={initialValues}
                        validationSchema={toFormikValidationSchema(
                            PUBLICATION_VERSION_EDIT_SCHEMA
                        )}
                    />
                </div>
            </div>

            <PublicationAttachmentAddModal />
            <PublicationAttachmentDeleteModal />
        </>
    )
}

export default PublicationVersionEdit
