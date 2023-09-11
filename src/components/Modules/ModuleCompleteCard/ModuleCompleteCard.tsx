import { Button, Text } from '@pzh-ui/components'

import useModalStore from '@/store/modalStore'

const ModuleCompleteCard = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
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
                onPress={() => setActiveModal('moduleComplete')}
                data-testid="module-complete-button">
                Module afsluiten
            </Button>
        </div>
    )
}

export default ModuleCompleteCard
