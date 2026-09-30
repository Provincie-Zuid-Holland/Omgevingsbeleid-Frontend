import { Button } from '@pzh-ui/components'
import { FilePdf } from '@pzh-ui/icons'

import { useQueryClient } from '@tanstack/react-query'

import {
    getPublicationAnnouncementsGetListAnnouncementsQueryKey,
    usePublicationAnnouncementsPostCreateAnnouncement,
    usePublicationAnnouncementsPostCreateAnnouncementPdf,
} from '@/api/fetchers'
import useModalStore from '@/store/modalStore'
import { downloadFile } from '@/utils/file'

interface KennisgevingActionsProps {
    announcementUuid?: string
    actPackageUuid?: string
    isRegelingPublished: boolean
    isPublished: boolean
    isClosed?: boolean
    isLocked?: boolean
}

const KennisgevingActions = ({
    announcementUuid,
    actPackageUuid,
    isRegelingPublished,
    isPublished,
    isClosed,
    isLocked,
}: KennisgevingActionsProps) => {
    const queryClient = useQueryClient()
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const readOnly = isPublished || isClosed || isLocked

    const { mutate: createAnnouncement, isPending: creating } =
        usePublicationAnnouncementsPostCreateAnnouncement({
            mutation: {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationAnnouncementsGetListAnnouncementsQueryKey(
                                {
                                    act_package_uuid: actPackageUuid,
                                    limit: 100,
                                }
                            ),
                    })
                },
            },
        })

    const { mutate: exportPdf, isPending: exporting } =
        usePublicationAnnouncementsPostCreateAnnouncementPdf({
            mutation: {
                mutationFn: async ({ announcementUuid }): Promise<unknown> =>
                    downloadFile(
                        `/publication-announcements/${announcementUuid}/pdf_export`,
                        {}
                    ),
            },
        })

    if (!announcementUuid) {
        return (
            <Button
                size="small"
                variant="cta"
                isDisabled={!isRegelingPublished || isClosed || !actPackageUuid}
                isLoading={creating}
                onPress={() =>
                    actPackageUuid && createAnnouncement({ actPackageUuid })
                }>
                Maak kennisgeving
            </Button>
        )
    }

    return (
        <>
            <Button
                size="small"
                variant={readOnly ? 'secondary' : 'primary'}
                onPress={() =>
                    setActiveModal('publicationAnnouncementUpdate', {
                        announcementUuid,
                        readOnly,
                    })
                }>
                {readOnly ? 'Bekijk kennisgeving' : 'Bewerk kennisgeving'}
            </Button>
            <Button
                size="small"
                variant="secondary"
                icon={FilePdf}
                iconSize={16}
                isLoading={exporting}
                isDisabled={exporting}
                onPress={() => exportPdf({ announcementUuid })}>
                Export PDF
            </Button>
        </>
    )
}

export default KennisgevingActions
