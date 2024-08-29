import { Button, Divider, Heading, Text } from '@pzh-ui/components'
import { useParams } from 'react-router-dom'

import {
    useModulesModuleIdStatusGet,
    usePublicationEnvironmentsGet,
} from '@/api/fetchers'
import { ModalStateMap } from '@/components/Modals/types'
import PublicationPackages from '@/components/Publications/_OLD/PublicationPackages'
import useModalStore from '@/store/modalStore'

import { StepProps } from './types'

export const StepOne = ({ setStep }: StepProps) => {
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
                        environment.UUID ===
                        modalState.publication.Environment_UUID
                ),
        },
    })

    return (
        <div className="grid gap-4">
            <Heading level="2">Levering</Heading>

            <Text>
                {status?.Status} -{' '}
                {modalState?.version.Bill_Metadata.Official_Title} (
                {environment?.Can_Publicate ? 'Officiële' : 'Interne'}{' '}
                publicatie)
            </Text>
            <PublicationPackages
                environment={environment}
                procedureType={modalState?.publication.Procedure_Type}
                handleUpdateAction={() => setStep(2)}
                {...modalState?.version}
            />
            <Divider className="my-6" />
            <div className="flex items-center justify-end">
                <Button onPress={() => setActiveModal(null)}>Sluiten</Button>
            </div>
        </div>
    )
}
