import {
    usePublicationActPackagesGetDetailActPackage,
    usePublicationActReportsGetListActPackageReports,
    usePublicationAnnouncementPackagesGetDetailAnnouncementPackage,
    usePublicationAnnouncementReportsGetListAnnnouncementPackageReports,
} from '@/api/fetchers'
import { PublicationType } from '@/api/fetchers.schemas'

const usePackageDetailData = ({
    publicationType,
    id,
    pageIndex,
    PAGE_LIMIT,
}: {
    publicationType: PublicationType
    id?: string
    pageIndex: number
    PAGE_LIMIT: number
}) => {
    const actPackageQuery = usePublicationActPackagesGetDetailActPackage(
        String(id),
        {
            query: {
                enabled: publicationType === 'act' && !!id,
            },
        }
    )

    const announcementPackageQuery =
        usePublicationAnnouncementPackagesGetDetailAnnouncementPackage(
            String(id),
            {
                query: {
                    enabled: publicationType === 'announcement' && !!id,
                },
            }
        )

    const actReportsQuery = usePublicationActReportsGetListActPackageReports(
        {
            act_package_id: id,
            limit: PAGE_LIMIT,
            offset: (pageIndex - 1) * PAGE_LIMIT,
        },
        {
            query: {
                enabled: publicationType === 'act' && !!id,
            },
        }
    )

    const announcementReportsQuery =
        usePublicationAnnouncementReportsGetListAnnnouncementPackageReports(
            {
                announcement_package_id: id,
                limit: PAGE_LIMIT,
                offset: (pageIndex - 1) * PAGE_LIMIT,
            },
            {
                query: {
                    enabled: publicationType === 'announcement' && !!id,
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
