import { useQueryClient } from '@tanstack/react-query'

import {
    getPublicationActPackagesGetQueryKey,
    getPublicationsPublicationUuidVersionsGetQueryKey,
    usePublicationVersionsVersionUuidPackagesPost,
} from '@/api/fetchers'

interface ActionsProps {
    versionUUID?: string
    pubicationUUID: string
}

export const useActions = ({ versionUUID, pubicationUUID }: ActionsProps) => {
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
                            pubicationUUID
                        ),
                })
            },
        },
    })

    return { createPackage }
}
