import { Button, Divider, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import {
    useModulesModuleIdStatusGet,
    usePublicationEnvironmentsGet,
} from '@/api/fetchers'
import Modal from '@/components/Modal'
import PublicationPackages from '@/components/Publications/PublicationPackages'
import useModalStore from '@/store/modalStore'

import { ModalStateMap } from '../../types'

const PublicationPackagesModal = () => {
    const { moduleId } = useParams()

    const modalState = useModalStore(
        state => state.modalStates['publicationPackages']
    ) as ModalStateMap['publicationPackages']
    const setActiveModal = useModalStore(state => state.setActiveModal)

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
        <Modal id="publicationPackages" title="Leveringen" size="xl">
            <div className="grid gap-4">
                <Text>
                    {status?.Status} -{' '}
                    {modalState?.version.Bill_Metadata.Official_Title} (
                    {environment?.Can_Publicate ? 'Officiële' : 'Interne'}{' '}
                    publicatie)
                </Text>
                <PublicationPackages {...modalState?.version} />
            </div>
            <Divider className="my-6" />
            <div className="flex items-center justify-end">
                <Button onPress={() => setActiveModal(null)}>Sluiten</Button>
            </div>
        </Modal>
    )
}

export default PublicationPackagesModal
