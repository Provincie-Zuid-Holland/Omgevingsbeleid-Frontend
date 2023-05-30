import { Button, Text } from '@pzh-ui/components'

import { ModuleModalActions } from '../../Modals/ModuleModals/types'

interface ModuleInactiveCardProps {
    /** Set module modal state */
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleInactiveCard = ({ setModuleModal }: ModuleInactiveCardProps) => (
    <div
        className="py-4 px-6 bg-pzh-ui-light-blue"
        data-testid="module-inactive-card">
        <Text type="body" className="mb-2 font-bold">
            Module inactief
        </Text>
        <Text type="body" className="mb-3">
            Deze module is nog niet actief. Andere gebruikers kunnen deze module
            nog niet zien en kunnen nog geen onderdelen uit deze module
            bewerken.
        </Text>
        <Button
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
