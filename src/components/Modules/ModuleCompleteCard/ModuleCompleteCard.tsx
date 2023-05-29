import { Button, Text } from '@pzh-ui/components'

import { ModuleModalActions } from '@/components/Modals/ModuleModals/types'

interface ModuleCompleteCardProps {
    /** Set module modal state */
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleCompleteCard = ({ setModuleModal }: ModuleCompleteCardProps) => (
    <div className="mb-5 py-4 px-6 bg-pzh-gray-100">
        <Text type="body" className="mb-2 font-bold text-pzh-blue">
            Module afsluiten
        </Text>
        <Text type="body" className="mb-3">
            Is er een besluit vastgesteld? Sluit dan de module af.
        </Text>
        <Button
            variant="cta"
            onPress={() =>
                setModuleModal({
                    isOpen: true,
                    action: 'completeModule',
                })
            }>
            Module afsluiten
        </Button>
    </div>
)

export default ModuleCompleteCard
