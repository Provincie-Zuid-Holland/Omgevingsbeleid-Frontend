import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'
import { Heading, ListLink } from '@pzh-ui/components'
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
                <ul>
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
    const download = useDownloadStorageFile(file.File_UUID)

    return (
        <ListLink asChild>
            <button type="button" onClick={() => download.refetch()}>
                {file.Title}
            </button>
        </ListLink>
    )
}

export default ObjectRelatedFilesPublic
