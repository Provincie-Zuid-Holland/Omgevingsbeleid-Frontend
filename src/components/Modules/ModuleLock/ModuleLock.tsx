import { Divider, Notification, Text } from '@pzh-ui/components'
import { Lock, LockOpen } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import ToggleSwitch from '@/components/ToggleSwitch'
import useModule from '@/hooks/useModule'
import useRoles from '@/hooks/useRoles'

import { ModuleModalActions } from '../ModuleModals/types'

interface ModuleLockProps {
    /** Is module locked */
    locked: boolean
    /** Set module modal state */
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleLock = ({ locked, setModuleModal }: ModuleLockProps) => {
    const { moduleId } = useParams()
    const isAdmin = useRoles(['Beheerder'])

    const { useEditModule, isModuleManager } = useModule()
    const { mutate } = useEditModule()

    if (!isAdmin && !isModuleManager && locked) {
        return (
            <>
                <Divider className="mt-3" />
                <Notification variant="alert" className="mt-6">
                    De module is op dit moment gelockt, er kunnen geen
                    wijzigingen worden aangebracht.
                </Notification>
            </>
        )
    }

    return (
        <div className="flex mt-3 pt-4 pb-3 px-3 bg-pzh-gray-100">
            {locked ? <Lock size={24} /> : <LockOpen size={24} />}
            <Text className="ml-3">
                {locked
                    ? 'Onderdelen in deze module kunnen tijdelijk niet bewerkt worden'
                    : 'Onderdelen in deze module mogen worden bewerkt door de behandelend ambtenaren'}
            </Text>
            <div className="ml-auto">
                <ToggleSwitch
                    title={locked ? 'Module unlocken' : 'Module locken'}
                    checked={!locked}
                    onClick={checked => {
                        if (!checked) {
                            setModuleModal({
                                isOpen: true,
                                action: 'lock',
                            })
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
        </div>
    )
}

export default ModuleLock
