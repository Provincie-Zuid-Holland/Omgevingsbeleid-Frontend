import { Button } from '@pzh-ui/components'
import { Check, Plus } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { usePublicationsGet } from '@/api/fetchers'
import { DocumentType, PublicationEnvironment } from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

interface PublicationEnvironmentActionProps extends PublicationEnvironment {
    type: DocumentType
}

const PublicationEnvironmentAction = ({
    type,
    Title,
    UUID,
}: PublicationEnvironmentActionProps) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data } = usePublicationsGet(
        { document_type: type, module_id: parseInt(moduleId!) },
        {
            query: {
                enabled: !!moduleId,
                select: data =>
                    data.results.find(
                        publication => publication.Environment_UUID === UUID
                    ),
            },
        }
    )

    return (
        <Button
            icon={data?.Is_Locked ? Check : Plus}
            variant="secondary"
            size="small"
            className="w-full [&_div]:justify-center"
            onPress={() =>
                setActiveModal('publicationAdd', {
                    type,
                })
            }>
            Nieuwe {Title.toLowerCase()} publicatie
        </Button>
    )
}

export default PublicationEnvironmentAction
