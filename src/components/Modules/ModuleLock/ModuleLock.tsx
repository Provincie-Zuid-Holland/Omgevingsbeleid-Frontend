import { cn, Divider, Notification, Text } from '@pzh-ui/components'
import { Lock, LockOpen } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import ToggleSwitch from '@/components/ToggleSwitch'
import useModule from '@/hooks/useModule'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

const ModuleLock = () => {
    const { moduleId } = useParams()
    const { canEditModule } = usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { useEditModule, isModuleManager, isLocked, canComplete } =
        useModule()
    const { mutate } = useEditModule('moduleUnlocked')

    if (!canEditModule && !isModuleManager && isLocked) {
        return <LockedNotification />
    } else if (!canEditModule && !isModuleManager && !isLocked) {
        return <Divider className="mb-4" />
    }

    return (
        <div className="bg-pzh-gray-100 mt-6 flex items-center px-4 py-2">
            {isLocked ? <Lock size={24} /> : <LockOpen size={24} />}
            <Text className="ml-3">
                {isLocked
                    ? canComplete
                        ? 'Onderdelen in deze module kun niet meer worden bewerkt'
                        : 'Onderdelen in deze module kunnen tijdelijk niet bewerkt worden'
                    : 'Onderdelen in deze module mogen worden bewerkt door de behandelend ambtenaren'}
            </Text>
            {!canComplete && (
                <div className="ml-auto">
                    <ToggleSwitch
                        title={isLocked ? 'Module unlocken' : 'Module locken'}
                        checked={!isLocked}
                        onClick={checked => {
                            if (!checked) {
                                setActiveModal('moduleLock')
                            } else {
                                mutate({
                                    moduleId: parseInt(moduleId!),
                                    data: {
                                        Temporary_Locked: false,
                                    },
                                })
                            }
                        }}
                    />
                </div>
            )}
        </div>
    )
}

interface LockedNotificationProps {
    isDetail?: boolean
}

export const LockedNotification = ({ isDetail }: LockedNotificationProps) => (
    <>
        {!isDetail && <Divider className="mt-3" />}
        <Notification
            variant="warning"
            title="De module is op dit moment gelockt, er kunnen geen wijzigingen worden aangebracht."
            className={cn('w-full', { 'mt-6': !isDetail })}
        />
    </>
)

export default ModuleLock
