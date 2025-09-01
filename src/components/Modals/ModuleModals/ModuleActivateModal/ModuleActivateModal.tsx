import { Button, Text } from '@pzh-ui/components'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import {
    getModulesGetListModulesQueryKey,
    getModulesViewModuleOverviewQueryKey,
    useModulesPostActivateModule,
} from '@/api/fetchers'
import Modal from '@/components/Modal'
import { ModalFooter } from '@/components/Modal/Modal'
import useModalStore from '@/store/modalStore'
import { toastNotification } from '@/utils/toastNotification'

const ModuleActivateModal = () => {
    const queryClient = useQueryClient()
    const { moduleId } = useParams()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    /**
     * Activate module
     */
    const { mutate, isPending } = useModulesPostActivateModule({
        mutation: {
            onSuccess: () => {
                Promise.all([
                    queryClient.invalidateQueries({
                        queryKey: getModulesGetListModulesQueryKey(),
                        refetchType: 'all',
                    }),
                    queryClient.invalidateQueries({
                        queryKey: getModulesViewModuleOverviewQueryKey(
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

            <ModalFooter>
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
            </ModalFooter>
        </Modal>
    )
}

export default ModuleActivateModal
