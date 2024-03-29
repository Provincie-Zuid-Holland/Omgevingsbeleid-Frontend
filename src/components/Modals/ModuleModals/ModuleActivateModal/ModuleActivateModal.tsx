import { Button, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
    getModulesGetQueryKey,
    getModulesModuleIdGetQueryKey,
    useModulesModuleIdActivatePost,
} from '@/api/fetchers'
import Modal from '@/components/Modal'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'

const ModuleActivateModal = () => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    /**
     * Activate module
     */
    const { mutate, isPending } = useModulesModuleIdActivatePost({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: getModulesGetQueryKey(),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({
                        queryKey: getModulesModuleIdGetQueryKey(
                            parseInt(moduleId!)
                        ),
                    }),
                ]).then(() => setActiveModal(null))

                toastNotification('moduleActivate')
            },
        },
    })

    return (
        <Modal id="moduleActivate" title="Module activeren">
            <Text>
                Wanneer je de module activeert, zal de module zichtbaar worden
                voor alle behandelend ambtenaren die zijn aangewezen als
                eigenaar van één of meerdere objecten in deze module.
            </Text>

            <div className="mt-6 flex items-center justify-between">
                <Button variant="link" onPress={() => setActiveModal(null)}>
                    Annuleren
                </Button>
                <Button
                    variant="cta"
                    onPress={() => mutate({ moduleId: parseInt(moduleId!) })}
                    isDisabled={isPending}
                    isLoading={isPending}>
                    Activeren
                </Button>
            </div>
        </Modal>
    )
}

export default ModuleActivateModal
