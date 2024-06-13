import { Button, Text, Tooltip } from '@pzh-ui/components'
import { CircleInfo } from '@pzh-ui/icons'

import useModalStore from '@/store/modalStore'

const ModuleCompleteCard = () => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <div
            className="mb-5 bg-pzh-gray-100 px-8 py-6"
            data-testid="module-complete-card">
            <Text className="mb-2" bold color="text-pzh-blue-500">
                Module afsluiten
            </Text>

            <Text className="mb-4">
                Is er een besluit vastgesteld? Sluit dan de module af.
            </Text>
            <div className="mb-2 flex items-center">
                <Button
                    variant="cta"
                    onPress={() => setActiveModal('moduleComplete')}
                    isDisabled
                    data-testid="module-complete-button">
                    Module afsluiten
                </Button>
                <Tooltip label="Afronden niet mogelijk via User Interface, neem contact op met team Omgevingsbeleid">
                    <CircleInfo
                        className="text-pzh-blue-500 ml-2 cursor-help"
                        size={18}
                    />
                </Tooltip>
            </div>
        </div>
    )
}

export default ModuleCompleteCard
