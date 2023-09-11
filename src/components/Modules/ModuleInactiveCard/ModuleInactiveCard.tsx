import { Button, Text } from '@pzh-ui/components'

import useModalStore from '@/store/modalStore'

const ModuleInactiveCard = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <div className="bg-pzh-ui-light-blue px-8 py-6">
            <Text bold className="mb-2">
                Module inactief
            </Text>
            <Text className="mb-4">
                Deze module is nog niet actief. Andere gebruikers kunnen deze
                module nog niet zien en kunnen nog geen onderdelen uit deze
                module bewerken.
            </Text>
            <Button
                data-testid="module-activate"
                onPress={() => setActiveModal('moduleActivate')}>
                Activeer module
            </Button>
        </div>
    )
}

export default ModuleInactiveCard
