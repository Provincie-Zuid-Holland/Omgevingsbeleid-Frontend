import { Button, Divider, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import {
    useModulesModuleIdStatusGet,
    usePublicationEnvironmentsGet,
} from '@/api/fetchers'
import Modal from '@/components/Modal/Modal'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationVersionAbortModal = () => {
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)
    const modalState = useModalStore(
        state => state.modalStates['publicationVersionAbort']
    ) as ModalStateMap['publicationVersionAbort']

    const { data: status } = useModulesModuleIdStatusGet(parseInt(moduleId!), {
        query: {
            enabled: !!moduleId,
            select: data =>
                data.find(
                    item => item.ID === modalState?.version.Module_Status.ID
                ),
        },
    })

    const { data: environment } = usePublicationEnvironmentsGet(undefined, {
        query: {
            select: data =>
                data.results.find(
                    environment =>
                        environment.UUID === modalState.version.Environment_UUID
                ),
        },
    })

    return (
        <Modal
            id="publicationVersionAbort"
            title="Publicatie afbreken"
            size="xl">
            <div className="grid gap-4">
                <Text>
                    {status?.Status} -{' '}
                    {modalState?.version.Bill_Metadata.Official_Title} (
                    {environment?.Can_Publicate ? 'Officiële' : 'Interne'}{' '}
                    publicatie)
                </Text>
                <PublicationPackages isAbort {...modalState?.version} />
            </div>
            <Divider className="my-6" />
            <div className="flex items-center justify-end">
                <Button onPress={() => setActiveModal(null)}>Sluiten</Button>
            </div>
        </Modal>
    )
}

export default PublicationVersionAbortModal
