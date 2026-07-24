import { getStorageFileGetFilesDownloadQueryKey } from '@/api/fetchers'
import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import { downloadFile } from '@/utils/file'
import { parseUtc } from '@/utils/parseUtc'
import { formatDate, Heading, Text } from '@pzh-ui/components'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface ObjectRelatedFilesPublicProps {
    data: ModelReturnType
}

const ObjectRelatedFilesPublic = ({ data }: ObjectRelatedFilesPublicProps) => {
    const files = useMemo(
        () =>
            [...(data.Related_Files ?? [])].sort(
                (a, b) =>
                    new Date(b.Created_Date).getTime() -
                    new Date(a.Created_Date).getTime()
            ),
        [data.Related_Files]
    )

    return (
        <div data-section="Gerelateerde bestanden">
            <Heading level="2" className="mb-4">
                Gerelateerde bestanden
            </Heading>

            {!files.length ? (
                <span className="text-pzh-gray-600 italic">
                    Er zijn nog geen bestanden gekoppeld
                </span>
            ) : (
                <ul className="flex flex-col gap-3">
                    {files.map(file => (
                        <li key={file.UUID}>
                            <RelatedFile file={file} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const RelatedFile = ({ file }: { file: ObjectRelatedFileResponse }) => {
    const download = useQuery({
        queryKey: ['downloadStorageFile', file.File_UUID],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(file.File_UUID)[0],
                undefined,
                true
            ),
        enabled: false,
    })

    return (
        <button
            type="button"
            onClick={() => download.refetch()}
            className="text-left">
            <Text
                as="span"
                bold
                className="text-pzh-green-500 hover:underline">
                {file.Title}
            </Text>
            <Text size="s" color="text-pzh-gray-500">
                Geüpload op {formatDate(parseUtc(file.Created_Date), 'dd-MM-yyyy')}
            </Text>
        </button>
    )
}

export default ObjectRelatedFilesPublic
