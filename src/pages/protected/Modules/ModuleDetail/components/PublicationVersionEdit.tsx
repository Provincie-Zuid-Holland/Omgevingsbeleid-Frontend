import {
    getPublicationVersionsGetListVersionsQueryKey,
    usePublicationEnvironmentsGetDetailEnvironment,
    usePublicationVersionsGetDetailVersion,
    usePublicationVersionsPostEditVersion,
} from '@/api/fetchers'
import {
    PublicationVersion,
    PublicationVersionEdit as PublicationVersionEditSchema,
} from '@/api/fetchers.schemas'
import { LoaderContent } from '@/components/Loader'
import {
    PublicationAttachmentAddModal,
    PublicationAttachmentDeleteModal,
} from '@/components/Modals/PublicationModals'
import PublicationVersionForm from '@/components/Publications/PublicationVersionForm'
import useModule from '@/hooks/useModule'
import { buildVersionTitle } from '@/pages/protected/Packages/config'
import MutateLayout from '@/templates/MutateLayout'
import { toastNotification } from '@/utils/toastNotification'
import { PUBLICATION_VERSION_EDIT_SCHEMA } from '@/validation/publication'
import { Heading } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const hasValue = (value?: string | null) => !!value?.trim()

const PublicationVersionEdit = () => {
    const { moduleId, versionUUID } = useParams()
    const navigate = useNavigate()

    const queryClient = useQueryClient()

    const { isLoading: moduleLoading, data: module } = useModule()

    const { data, isFetching, queryKey } =
        usePublicationVersionsGetDetailVersion(String(versionUUID), {
            query: {
                enabled: !!versionUUID,
            },
        })

    const { data: environment } =
        usePublicationEnvironmentsGetDetailEnvironment(
            String(data?.Publication.Environment_UUID),
            {
                query: {
                    enabled: !!data?.Publication.Environment_UUID,
                },
            }
        )

    const { mutate } = usePublicationVersionsPostEditVersion({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: getPublicationVersionsGetListVersionsQueryKey(
                            String(data?.Publication.UUID)
                        ),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({
                        queryKey,
                    }),
                ]).then(() => navigate(`/muteer/modules/${moduleId}/besluiten`))

                toastNotification('saved')
            },
        },
    })

    const handleFormSubmit = (payload: PublicationVersionEditSchema) => {
        const motivation = payload.Bill_Compact?.Motivation

        const hasMotivation =
            hasValue(motivation?.Title) ||
            hasValue(motivation?.Content) ||
            !!motivation?.Appendices?.length

        mutate({
            versionUuid: String(versionUUID),
            data: {
                ...payload,
                Bill_Compact: {
                    ...payload.Bill_Compact,
                    Motivation: hasMotivation ? motivation : null,
                },
            },
        })
    }

    const title = buildVersionTitle(data, environment)

    const initialValues = {
        ...data,
        Effective_Date:
            data?.Publication.Procedure_Type === 'draft'
                ? null
                : (data?.Effective_Date ?? null),
        Module_Status_ID: data?.Module_Status.ID,
    } as PublicationVersion

    const breadcrumbPaths = [
        { name: 'Dashboard', path: '/muteer' },
        { name: 'Modules', path: '/muteer/modules' },
        {
            name: module?.Module.Title || '',
            path: `/muteer/modules/${moduleId}`,
        },
        { name: 'Besluit bewerken', isCurrent: true },
    ]

    if (isFetching || moduleLoading) return <LoaderContent />

    return (
        <MutateLayout title="Besluit bewerken" breadcrumbs={breadcrumbPaths}>
            <div className="col-span-4 col-start-2">
                <Heading level="1" size="xxl">
                    Besluit bewerken
                </Heading>
                <Heading level="2" size="m" className="mb-4">
                    {title}
                </Heading>

                <PublicationVersionForm
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={toFormikValidationSchema(
                        PUBLICATION_VERSION_EDIT_SCHEMA
                    )}
                />
            </div>

            <PublicationAttachmentAddModal />
            <PublicationAttachmentDeleteModal />
        </MutateLayout>
    )
}

export default PublicationVersionEdit
