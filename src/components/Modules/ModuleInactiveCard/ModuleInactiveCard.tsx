import { Button, Text } from '@pzh-ui/components'

import { ModuleModalActions } from '../../Modals/ModuleModals/types'

interface ModuleInactiveCardProps {
    /** Set module modal state */
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleInactiveCard = ({ setModuleModal }: ModuleInactiveCardProps) => (
    <div className="bg-pzh-ui-light-blue px-8 py-6">
        <Text bold className="mb-2">
            Module inactief
        </Text>
        <Text className="mb-4">
            Deze module is nog niet actief. Andere gebruikers kunnen deze module
            nog niet zien en kunnen nog geen onderdelen uit deze module
            bewerken.
        </Text>
        <Button
            data-testid="module-activate"
            onPress={() =>
                setModuleModal({
                    isOpen: true,
                    action: 'activate',
                })
            }>
            Activeer module
        </Button>
    </div>
)

export default ModuleInactiveCard
