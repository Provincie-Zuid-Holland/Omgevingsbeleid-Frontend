import { Button, Heading, ListLink } from '@pzh-ui/components'
import { ArrowUpRightFromSquare } from '@pzh-ui/icons'

import { useParams } from 'react-router-dom'

import {
    useDocumentViewModuleObjectLatest,
    useDocumentViewObjectLatest,
} from '@/api/fetchers'
import { ObjectStatics } from '@/api/fetchers.schemas'
import useAuth from '@/hooks/useAuth'
import useDownloadStorageFile from '@/hooks/useDownloadStorageFile'

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
                <Document key={document.code} {...document} />
            ))}
        </div>
    </div>
)

const Document = ({ cached_title, object_id }: ObjectStatics) => {
    const { moduleId } = useParams()
    const { user } = useAuth()

    const {
        data: moduleData,
        isSuccess,
        isError,
    } = useDocumentViewModuleObjectLatest(parseInt(moduleId!), object_id, {
        query: {
            enabled: !!moduleId && !!object_id && !!user,
        },
    })

    const { data: validData } = useDocumentViewObjectLatest(object_id, {
        query: {
            enabled:
                (!moduleId && !!object_id) ||
                (!!moduleId && !!object_id && !moduleData) ||
                isError,
        },
    })

    const data = moduleId && isSuccess ? moduleData : validData

    const downloadDocument = useDownloadStorageFile(data?.file_id)

    if (!data?.file_id) return null

    return (
        <ListLink asChild>
            <Button
                variant="default"
                onPress={() => downloadDocument.refetch()}>
                {cached_title}{' '}
                <ArrowUpRightFromSquare className="ml-1" size={18} />
            </Button>
        </ListLink>
    )
}

export default ObjectConnectedDocuments
