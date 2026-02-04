import {
    usePublicationActPackagesGetDetailActPackage,
    usePublicationActReportsGetListActPackageReports,
    usePublicationAnnouncementPackagesGetDetailAnnouncementPackage,
    usePublicationAnnouncementReportsGetListAnnnouncementPackageReports,
} from '@/api/fetchers'
import { PublicationType } from '@/api/fetchers.schemas'

const usePackageDetailData = ({
    publicationType,
    uuid,
    pageIndex,
    PAGE_LIMIT,
}: {
    publicationType: PublicationType
    uuid?: string
    pageIndex: number
    PAGE_LIMIT: number
}) => {
    const actPackageQuery = usePublicationActPackagesGetDetailActPackage(
        String(uuid),
        {
            query: {
                enabled: publicationType === 'act' && !!uuid,
            },
        }
    )

    const announcementPackageQuery =
        usePublicationAnnouncementPackagesGetDetailAnnouncementPackage(
            String(uuid),
            {
                query: {
                    enabled: publicationType === 'announcement' && !!uuid,
                },
            }
        )

    const actReportsQuery = usePublicationActReportsGetListActPackageReports(
        {
            act_package_uuid: uuid,
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
        },
        {
            query: {
                enabled: publicationType === 'act' && !!uuid,
            },
        }
    )

    const announcementReportsQuery =
        usePublicationAnnouncementReportsGetListAnnnouncementPackageReports(
            {
                announcement_package_uuid: uuid,
                limit: PAGE_LIMIT,
                offset: (pageIndex - 1) * PAGE_LIMIT,
            },
            {
                query: {
                    enabled: publicationType === 'announcement' && !!uuid,
                },
            }
        )

    if (publicationType === 'act') {
        return {
            data: actPackageQuery.data,
            isLoading: actPackageQuery.isLoading,
            reports: actReportsQuery.data,
        }
    }

    return {
        data: announcementPackageQuery.data,
        isLoading: announcementPackageQuery.isLoading,
        reports: announcementReportsQuery.data,
    }
}

export default usePackageDetailData
