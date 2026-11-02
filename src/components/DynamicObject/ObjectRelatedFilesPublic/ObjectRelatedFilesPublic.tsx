import { useMemo } from 'react'

import { Heading, ListLink } from '@pzh-ui/components'

import { ObjectRelatedFileResponse } from '@/api/fetchers.schemas'
import { ModelReturnType } from '@/config/objects/types'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'

interface ObjectRelatedFilesPublicProps {
    data: ModelReturnType
}

const ObjectRelatedFilesPublic = ({ data }: ObjectRelatedFilesPublicProps) => {
    const files = useMemo(
        () =>
            [...(data.related_files ?? [])].sort(
                (a, b) =>
                    new Date(b.created_date).getTime() -
                    new Date(a.created_date).getTime()
            ),
        [data.related_files]
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
                        <li key={file.id}>
                            <RelatedFile file={file} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const RelatedFile = ({ file }: { file: ObjectRelatedFileResponse }) => {
    const download = useDownloadStorageFile(file.file_id)

    return (
        <ListLink asChild>
            <button type="button" onClick={() => download.refetch()}>
                {file.title}
            </button>
        </ListLink>
    )
}

export default ObjectRelatedFilesPublic
