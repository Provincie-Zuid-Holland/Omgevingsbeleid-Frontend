import { Button, Heading, Modal, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
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
    const { id } = useParams()

    /**
     * Activate module
     */
    const { mutate, isLoading } = useModulesModuleIdActivatePost({
        mutation: {
            onError: () => {
                toastNotification({ type: 'standard error' })
            },
            onSuccess: () => {
                queryClient
                    .invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(id!))
                    )
                    .then(() => onClose())

                toastNotification({ type: 'saved' })
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
                <button type="button" className="underline" onClick={onClose}>
                    Annuleren
                </button>
                <Button
                    variant="cta"
                    onPress={() => mutate({ moduleId: parseInt(id!) })}
                    isDisabled={isLoading}
                    isLoading={isLoading}>
                    Activeren
                </Button>
            </div>
        </Modal>
    )
}

export default ModuleActivateModal
