import { Button, Heading, Modal, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
    getModulesGetQueryKey,
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdActivatePost,
} from '@/api/fetchers'
import { toastNotification } from '@/utils/toastNotification'

interface ModuleActivateModalProps {
    isOpen: boolean
    onClose: () => void
}

const ModuleActivateModal = ({ isOpen, onClose }: ModuleActivateModalProps) => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    /**
     * Activate module
     */
    const { mutate, isLoading } = useModulesModuleIdActivatePost({
        mutation: {
            onError: () => {
                toastNotification('moduleActivate')
            },
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(getModulesGetQueryKey(), {
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                    ),
                ]).then(() => onClose())

                toastNotification('saved')
            },
        },
    })

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            ariaLabel="Module activeren"
            maxWidth="sm:max-w-[812px]">
            <Heading level="2" className="mb-4">
                Module activeren
            </Heading>

            <Text>
                Wanneer je de module activeert, zullen de volgende acties worden
                uitgevoerd:
                <ul className="ml-4 mt-4 list-disc">
                    <li>Module wordt in het systeem zichtbaar</li>
                    <li>Nieuwe objecten worden aangemaakt</li>
                    <li>
                        Eigenaren van de objecten zullen op de hoogte worden
                        gesteld
                    </li>
                </ul>
            </Text>

            <div className="mt-6 flex items-center justify-between">
                <Button variant="link" onPress={onClose}>
                    Annuleren
                </Button>
                <Button
                    variant="cta"
                    onPress={() => mutate({ moduleId: parseInt(moduleId!) })}
                    isDisabled={isLoading}
                    isLoading={isLoading}>
                    Activeren
                </Button>
            </div>
        </Modal>
    )
}

export default ModuleActivateModal
