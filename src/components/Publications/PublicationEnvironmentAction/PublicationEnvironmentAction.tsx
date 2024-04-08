import { Button } from '@pzh-ui/components'
import { Check, Hourglass, Plus } from '@pzh-ui/icons'
import clsx from 'clsx'

import {
    DocumentType,
    ProcedureType,
    PublicationEnvironment,
} from '@/api/fetchers.schemas'
import useModalStore from '@/store/modalStore'

interface PublicationEnvironmentActionProps extends PublicationEnvironment {
    documentType: DocumentType
    procedureType: ProcedureType
    state?: 'pending' | 'success'
}

const PublicationEnvironmentAction = ({
    documentType,
    procedureType,
    Title,
    UUID,
    state,
}: PublicationEnvironmentActionProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    if (state === 'pending' || state === 'success') {
        return (
            <Button
                variant="secondary"
                size="small"
                icon={state === 'pending' ? Hourglass : Check}
                className={clsx('w-full justify-center', {
                    'border-pzh-yellow-500 bg-pzh-yellow-10 hover:border-pzh-yellow-900':
                        state === 'pending',
                    'border-pzh-green-500 bg-pzh-green-10 hover:border-pzh-green-900':
                        state === 'success',
                })}>
                {Title} publicatie
            </Button>
        )
    }

    return (
        <Button
            icon={Plus}
            variant="secondary"
            size="small"
            className="w-full justify-center"
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
