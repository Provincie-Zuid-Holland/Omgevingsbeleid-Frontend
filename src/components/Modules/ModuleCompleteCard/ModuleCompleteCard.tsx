import { Button, cn, Text, Tooltip } from '@pzh-ui/components'
import { CircleInfo } from '@pzh-ui/icons'

import useModalStore from '@/store/modalStore'

interface ModuleCompleteCardProps {
    variant?: 'column' | 'row'
}

const ModuleCompleteCard = ({
    variant = 'column',
}: ModuleCompleteCardProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    return (
        <div
            className={cn('bg-pzh-gray-100', {
                'mb-5 px-8 py-6': variant === 'column',
                'flex items-center justify-between p-4': variant === 'row',
            })}
            data-testid="module-complete-card">
            {variant === 'column' && (
                <Text className="mb-2" bold color="text-pzh-blue-500">
                    Module afsluiten
                </Text>
            )}

            <Text className={cn({ 'mb-4': variant === 'column' })}>
                Is er een besluit vastgesteld? Sluit dan de module af.
            </Text>
            <div className="flex items-center">
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
