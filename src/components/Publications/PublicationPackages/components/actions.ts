import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
    getPublicationActPackagesActPackageUuidDownloadGetQueryKey,
    getPublicationActPackagesGetQueryKey,
    getPublicationAnnouncementPackagesAnnouncementPackageUuidDownloadGetQueryKey,
    getPublicationAnnouncementPackagesGetQueryKey,
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationActPackagesActPackageUuidReportPost,
    usePublicationAnnouncementPackagesAnnouncementPackageUuidReportPost,
    usePublicationAnnouncementsAnnouncementUuidPackagesPost,
    usePublicationVersionsVersionUuidPackagesPost,
} from '@/api/fetchers'
import { HTTPValidationError } from '@/api/fetchers.schemas'
import { downloadFile } from '@/utils/file'

import { PublicationType } from '../../types'

interface ActionsProps {
    publicationType: PublicationType
    versionUUID?: string
    announcementUUID?: string
    publicationUUID: string
    packageUUID?: string
}

export const useActions = ({
    publicationType,
    versionUUID,
    announcementUUID,
    publicationUUID,
    packageUUID,
}: ActionsProps) => {
    const queryClient = useQueryClient()

    const createPackage = (
        publicationType === 'act'
            ? usePublicationVersionsVersionUuidPackagesPost
            : usePublicationAnnouncementsAnnouncementUuidPackagesPost
    )({
        mutation: {
            onSuccess: () => {
                if (publicationType === 'act') {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationActPackagesGetQueryKey({
                            version_uuid: versionUUID,
                        }),
                    })
                } else {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationAnnouncementPackagesGetQueryKey(
                            {
                                announcement_uuid: announcementUUID,
                            }
                        ),
                    })
                }
                queryClient.invalidateQueries({
                    queryKey:
                        getPublicationsPublicationUuidVersionsGetQueryKey(
                            publicationUUID
                        ),
                })
                queryClient.invalidateQueries({
                    queryKey: getPublicationsPublicationUuidVersionsGetQueryKey(
                        publicationUUID,
                        {
                            limit: 100,
                        }
                    ),
                })
            },
            onError: (error: AxiosError<HTTPValidationError>) => {
                console.error(
                    'Er is iets mis gegaan bij het maken van de levering, zie foutmelding:\n\n',
                    JSON.stringify(error.response?.data.detail, null, 2)
                )
            },
        },
    })

    const downloadPackage = useQuery({
        queryKey: ['downloadPackage', packageUUID, versionUUID],
        queryFn: async () =>
            downloadFile(
                (publicationType === 'act'
                    ? getPublicationActPackagesActPackageUuidDownloadGetQueryKey
                    : getPublicationAnnouncementPackagesAnnouncementPackageUuidDownloadGetQueryKey)(
                    String(packageUUID)
                )[0]
            ).finally(() =>
                queryClient.invalidateQueries({
                    queryKey:
                        publicationType === 'act'
                            ? getPublicationActPackagesGetQueryKey({
                                  version_uuid: versionUUID,
                              })
                            : getPublicationAnnouncementPackagesGetQueryKey({
                                  announcement_uuid: announcementUUID,
                              }),
                })
            ),
        enabled: false,
    })

    const uploadReports = (
        publicationType === 'act'
            ? usePublicationActPackagesActPackageUuidReportPost
            : usePublicationAnnouncementPackagesAnnouncementPackageUuidReportPost
    )({
        mutation: {
            onSuccess: data => {
                if (publicationType === 'act') {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationActPackagesGetQueryKey({
                            version_uuid: versionUUID,
                        }),
                    })
                } else {
                    queryClient.invalidateQueries({
                        queryKey: getPublicationAnnouncementPackagesGetQueryKey(
                            {
                                announcement_uuid: announcementUUID,
                            }
                        ),
                    })
                }

                if (data.Status === 'valid') {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationsPublicationUuidVersionsGetQueryKey(
                                publicationUUID
                            ),
                    })
                }
            },
        },
    })

    return { createPackage, downloadPackage, uploadReports }
}
