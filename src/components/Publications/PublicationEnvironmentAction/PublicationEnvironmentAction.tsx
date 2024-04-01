import { Button } from '@pzh-ui/components'
import { Check, Plus } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import { usePublicationsGet } from '@/api/fetchers'
import {
    DocumentType,
    ProcedureType,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

interface PublicationEnvironmentActionProps extends PublicationEnvironment {
    documentType: DocumentType
    procedureType: ProcedureType
}

const PublicationEnvironmentAction = ({
    documentType,
    procedureType,
    Title,
    UUID,
}: PublicationEnvironmentActionProps) => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { data } = usePublicationsGet(
        { document_type: documentType, module_id: parseInt(moduleId!) },
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
                    documentType,
                    procedureType,
                    environmentUUID: UUID,
                })
            }>
            Nieuwe {Title.toLowerCase()} publicatie
        </Button>
    )
}

export default PublicationEnvironmentAction
