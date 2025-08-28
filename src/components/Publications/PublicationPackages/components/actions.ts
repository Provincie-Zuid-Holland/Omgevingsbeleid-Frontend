import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
    getPublicationActPackagesGetDownloadActPackageQueryKey,
    getPublicationActPackagesGetListActPackagesQueryKey,
    getPublicationActReportsGetDownloadActPackageReportQueryKey,
    getPublicationAnnouncementPackagesGetDownloadAnnouncementPackageQueryKey,
    getPublicationAnnouncementPackagesGetListAnnouncementPackagesQueryKey,
    getPublicationAnnouncementReportsGetDownloadAnnouncementPackageReportQueryKey,
    getPublicationPackagesGetListUnifiedPackagesQueryKey,
    getPublicationVersionsGetListVersionsQueryKey,
    usePublicationActPackagesPostCreateActPackage,
    usePublicationActReportsPostUploadActPackageReport,
    usePublicationAnnouncementPackagesPostCreateAnnouncementPackage,
    usePublicationAnnouncementReportsPostUploadAnnouncementPackageReport,
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
    reportUUID?: string
}

export const useActions = ({
    publicationType,
    versionUUID,
    announcementUUID,
    publicationUUID,
    packageUUID,
    reportUUID,
}: ActionsProps) => {
    const queryClient = useQueryClient()

    const createPackage = (
        publicationType === 'act'
            ? usePublicationActPackagesPostCreateActPackage
            : usePublicationAnnouncementPackagesPostCreateAnnouncementPackage
    )({
        mutation: {
            onSuccess: () => {
                if (publicationType === 'act') {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationActPackagesGetListActPackagesQueryKey(
                                {
                                    version_uuid: versionUUID,
                                }
                            ),
                    })
                } else {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationAnnouncementPackagesGetListAnnouncementPackagesQueryKey(
                                {
                                    announcement_uuid: announcementUUID,
                                }
                            ),
                    })
                }
                queryClient.invalidateQueries({
                    queryKey:
                        getPublicationVersionsGetListVersionsQueryKey(
                            publicationUUID
                        ),
                })
                queryClient.invalidateQueries({
                    queryKey: getPublicationVersionsGetListVersionsQueryKey(
                        publicationUUID,
                        {
                            limit: 100,
                        }
                    ),
                })
                queryClient.invalidateQueries({
                    queryKey:
                        getPublicationPackagesGetListUnifiedPackagesQueryKey(),
                    refetchType: 'all',
                    exact: false,
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
                    ? getPublicationActPackagesGetDownloadActPackageQueryKey
                    : getPublicationAnnouncementPackagesGetDownloadAnnouncementPackageQueryKey)(
                    String(packageUUID)
                )[0]
            ).finally(() =>
                queryClient.invalidateQueries({
                    queryKey:
                        publicationType === 'act'
                            ? getPublicationActPackagesGetListActPackagesQueryKey(
                                  {
                                      version_uuid: versionUUID,
                                  }
                              )
                            : getPublicationAnnouncementPackagesGetListAnnouncementPackagesQueryKey(
                                  {
                                      announcement_uuid: announcementUUID,
                                  }
                              ),
                })
            ),
        enabled: false,
    })

    const downloadReport = useQuery({
        queryKey: ['downloadReport', reportUUID, versionUUID],
        queryFn: async () =>
            downloadFile(
                (publicationType === 'act'
                    ? getPublicationActReportsGetDownloadActPackageReportQueryKey
                    : getPublicationAnnouncementReportsGetDownloadAnnouncementPackageReportQueryKey)(
                    String(reportUUID)
                )[0]
            ),
        enabled: false,
    })

    const uploadReports = (
        publicationType === 'act'
            ? usePublicationActReportsPostUploadActPackageReport
            : usePublicationAnnouncementReportsPostUploadAnnouncementPackageReport
    )({
        mutation: {
            onSuccess: data => {
                if (publicationType === 'act') {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationActPackagesGetListActPackagesQueryKey(
                                {
                                    version_uuid: versionUUID,
                                }
                            ),
                    })
                } else {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationAnnouncementPackagesGetListAnnouncementPackagesQueryKey(
                                {
                                    announcement_uuid: announcementUUID,
                                }
                            ),
                    })
                }

                if (data.Status === 'valid') {
                    queryClient.invalidateQueries({
                        queryKey:
                            getPublicationVersionsGetListVersionsQueryKey(
                                publicationUUID
                            ),
                    })
                }

                queryClient.invalidateQueries({
                    queryKey:
                        getPublicationPackagesGetListUnifiedPackagesQueryKey(),
                    refetchType: 'all',
                    exact: false,
                })
            },
        },
    })

    return { createPackage, downloadPackage, downloadReport, uploadReports }
}
