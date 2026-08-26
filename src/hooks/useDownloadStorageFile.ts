import { getStorageFileGetFilesDownloadQueryKey } from '@/api/fetchers'
import { downloadFile } from '@/utils/file'
import { useQuery } from '@tanstack/react-query'

/**
 * Downloads a storage file by UUID. The query is disabled by default —
 * call the returned `refetch` to trigger the download on demand (e.g.
 * from a click handler).
 */
const useDownloadStorageFile = (fileUuid?: string | null) =>
    useQuery({
        queryKey: ['downloadStorageFile', fileUuid],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(String(fileUuid))[0],
                undefined,
                true
            ),
        enabled: false,
    })

export default useDownloadStorageFile
