import {
    getStorageFileGetFilesDownloadQueryKey,
    useDocumentViewModuleObjectLatest,
    useDocumentViewObjectLatest,
} from '@/api/fetchers'
import { ObjectStatics } from '@/api/fetchers.schemas'
import useAuth from '@/hooks/useAuth'
import { downloadFile } from '@/utils/file'
import { Button, Heading, ListLink } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

interface ObjectConnectedDocumentsProps {
    documents: ObjectStatics[]
}

const ObjectConnectedDocuments = ({
    documents,
}: ObjectConnectedDocumentsProps) => (
    <>
        <Heading level="3" size="m" className="mb-2">
            Gekoppelde documenten
        </Heading>

        <div className="flex flex-col gap-2">
            {documents.map(document => (
                <Document key={document.Code} {...document} />
            ))}
        </div>
    </>
)

const Document = ({ Cached_Title, Object_ID }: ObjectStatics) => {
    const { moduleId } = useParams()
    const { user } = useAuth()

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useDocumentViewModuleObjectLatest(parseInt(moduleId!), Object_ID, {
        query: {
            enabled: !!moduleId && !!Object_ID && !!user,
        },
    })

    const { data: validData } = useDocumentViewObjectLatest(Object_ID, {
        query: {
            enabled:
                (!moduleId && !!Object_ID) ||
                (!!moduleId && !!Object_ID && !moduleData && isSuccess) ||
                isError,
        },
    })

    const data = moduleId && isSuccess ? moduleData : validData

    const downloadDocument = useQuery({
        queryKey: ['downloadStorageFile', data?.File_UUID],
        queryFn: () =>
            downloadFile(
                getStorageFileGetFilesDownloadQueryKey(
                    String(data?.File_UUID)
                )[0],
                undefined,
                true
            ),
        enabled: false,
    })

    if (!data?.File_UUID) return null

    return (
        <ListLink asChild>
            <Button
                variant="default"
                onPress={() => downloadDocument.refetch()}>
                {Cached_Title}{' '}
                <ArrowUpRightFromSquare className="ml-1" size={18} />
            </Button>
        </ListLink>
    )
}

export default ObjectConnectedDocuments
