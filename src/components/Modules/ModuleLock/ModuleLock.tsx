import { Text } from '@pzh-ui/components'
import { Lock, LockOpen } from '@pzh-ui/icons'
import { useParams } from 'react-router-dom'

import ToggleSwitch from '@/components/ToggleSwitch'
import useModules from '@/hooks/useModules'

import { ModuleModalActions } from '../ModuleModals/types'

interface ModuleLockProps {
    locked: boolean
    setModuleModal: (e: ModuleModalActions) => void
}

const ModuleLock = ({ locked, setModuleModal }: ModuleLockProps) => {
    const { id } = useParams()

    const { useEditModule } = useModules()
    const { mutate } = useEditModule(parseInt(id!))

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
                    checked={!locked}
                    onClick={checked => {
                        if (!checked) {
                            setModuleModal({
                                isOpen: true,
                                action: 'lock',
                            })
                        } else {
                            mutate({
                                moduleId: parseInt(id!),
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
