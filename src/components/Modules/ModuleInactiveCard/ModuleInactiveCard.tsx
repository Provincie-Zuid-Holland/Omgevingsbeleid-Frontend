import { Button, cn, Text } from '@pzh-ui/components'

import useModalStore from '@/store/modalStore'

interface ModuleInactiveCardProps {
    variant?: 'column' | 'row'
}

const ModuleInactiveCard = ({
    variant = 'column',
}: ModuleInactiveCardProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <div
            className={cn('bg-pzh-blue-10', {
                'px-8 py-6': variant === 'column',
                'p-6': variant === 'row',
            })}>
            <Text bold color="text-pzh-blue-500" className="mb-2">
                Module inactief
            </Text>
            <Text className="mb-4">
                Deze module is nog niet actief. Andere gebruikers kunnen deze
                module nog niet zien en kunnen nog geen onderdelen uit deze
                module bewerken.
            </Text>
            <Button
                variant="cta"
                data-testid="module-activate"
                onPress={() => setActiveModal('moduleActivate')}>
                Activeer module
            </Button>
        </div>
    )
}

export default ModuleInactiveCard
