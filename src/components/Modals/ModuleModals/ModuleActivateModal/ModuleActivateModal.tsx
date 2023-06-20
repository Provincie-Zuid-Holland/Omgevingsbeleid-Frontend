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
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries(getModulesGetQueryKey(), {
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries(
                        getModulesModuleIdGetQueryKey(parseInt(moduleId!))
                    ),
                ]).then(() => onClose())

                toastNotification('moduleActivate')
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
                Wanneer je de module activeert, zal de module zichtbaar worden
                voor alle behandelend ambtenaren die zijn aangewezen als
                eigenaar van één of meerdere objecten in deze module.
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
