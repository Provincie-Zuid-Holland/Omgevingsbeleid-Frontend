import { Button, Text } from '@pzh-ui/components'

import { ModuleModalActions } from '@/components/Modals/ModuleModals/types'

interface ModuleCompleteCardProps {
    /** Set module modal state */
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleCompleteCard = ({ setModuleModal }: ModuleCompleteCardProps) => (
    <div
        className="mb-5 bg-pzh-gray-100 px-8 py-6"
        data-testid="module-complete-card">
        <Text className="mb-2" bold color="text-pzh-blue">
            Module afsluiten
        </Text>
        <Text className="mb-4">
            Is er een besluit vastgesteld? Sluit dan de module af.
        </Text>
        <Button
            variant="cta"
            onPress={() =>
                setModuleModal({
                    isOpen: true,
                    action: 'completeModule',
                })
            }
            data-testid="module-complete-button">
            Module afsluiten
        </Button>
    </div>
)

export default ModuleCompleteCard
