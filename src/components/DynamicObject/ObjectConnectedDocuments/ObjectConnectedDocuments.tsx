import {
    useDocumentViewModuleObjectLatest,
    useDocumentViewObjectLatest,
} from '@/api/fetchers'
import { ObjectStatics } from '@/api/fetchers.schemas'
import useAuth from '@/hooks/useAuth'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'
import { Button, Heading, ListLink } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

interface ObjectConnectedDocumentsProps {
    documents: ObjectStatics[]
}

const ObjectConnectedDocuments = ({
    documents,
}: ObjectConnectedDocumentsProps) => (
    <div className="mb-6 group-has-[div:empty]:hidden">
        <Heading level="3" size="m" className="mb-2">
            Gekoppelde documenten
        </Heading>

        <div className="flex flex-col gap-2">
            {documents.map(document => (
                <Document key={document.Code} {...document} />
            ))}
        </div>
    </div>
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
                (!!moduleId && !!Object_ID && !moduleData) ||
                isError,
        },
    })

    const data = moduleId && isSuccess ? moduleData : validData

    const downloadDocument = useDownloadStorageFile(data?.File_UUID)

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
