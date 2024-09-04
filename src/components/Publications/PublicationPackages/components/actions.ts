import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import {
    getPublicationActPackagesActPackageUuidDownloadGetQueryKey,
    getPublicationActPackagesGetQueryKey,
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationVersionsVersionUuidPackagesPost,
} from '@/api/fetchers'
import { HTTPValidationError } from '@/api/fetchers.schemas'
import { downloadFile } from '@/utils/file'

interface ActionsProps {
    versionUUID?: string
    publicationUUID: string
    packageUUID?: string
}

export const useActions = ({
    versionUUID,
    publicationUUID,
    packageUUID,
}: ActionsProps) => {
    const queryClient = useQueryClient()

    const createPackage = usePublicationVersionsVersionUuidPackagesPost({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: getPublicationActPackagesGetQueryKey({
                        version_uuid: versionUUID,
                    }),
                })
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
                getPublicationActPackagesActPackageUuidDownloadGetQueryKey(
                    String(packageUUID)
                )[0]
            ).finally(() =>
                queryClient.invalidateQueries({
                    queryKey: getPublicationActPackagesGetQueryKey({
                        version_uuid: versionUUID,
                    }),
                })
            ),
        enabled: false,
    })

    return { createPackage, downloadPackage }
}
