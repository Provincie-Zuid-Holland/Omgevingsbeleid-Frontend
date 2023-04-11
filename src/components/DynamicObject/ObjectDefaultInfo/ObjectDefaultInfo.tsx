import { getHeadingStyles, Text } from '@pzh-ui/components'
import { PenToSquare, Plus, Spinner } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'

import { UserShort } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import ObjectPersonModal from '@/components/Modals/ObjectModals/ObjectPersonModal'
import { ObjectPersonModalActions } from '@/components/Modals/ObjectModals/types'
import { Model, ModelPatchStaticType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import {
    getStaticDataLabel,
    getStaticDataPropertyKey,
} from '@/utils/staticData'

interface ObjectDefaultInfoProps {
    model: Model
}

const ObjectDefaultInfo = ({ model }: ObjectDefaultInfoProps) => {
    const { canCreateModule, canPatchObjectInModule } = usePermissions()

    const { isMobile } = useBreakpoint()

    const [modal, setModal] = useState<ObjectPersonModalActions>({
        isOpen: false,
        initialValues: {} as ModelPatchStaticType,
    })

    const { staticData } = model

    const { data: object, isLoading, isOwner } = useObject()
    const data = useMemo(() => object?.ObjectStatics, [object?.ObjectStatics])

    /**
     * Handle item click
     */
    const handleClick = (person: ObjectPersonModalActions['person']) => {
        setModal({
            ...modal,
            person,
            isOpen: true,
        })
    }

    if (!!!staticData?.length) return null

    return (
        <>
            <div>
                <h2
                    style={getHeadingStyles('3', isMobile)}
                    className="mb-4 text-pzh-blue">
                    Algemene informatie
                </h2>

                {staticData.map(item => {
                    const label = getStaticDataLabel(item)
                    const key = getStaticDataPropertyKey(item)
                    const user = data?.[key]

                    return (
                        <Item
                            key={item}
                            label={label}
                            user={user}
                            handleClick={() =>
                                handleClick({ key: item, label, value: user })
                            }
                            isLoading={isLoading}
                            canEdit={
                                (canPatchObjectInModule && isOwner) ||
                                canCreateModule
                            }
                        />
                    )
                })}
            </div>

            <ObjectPersonModal
                onClose={() => setModal({ ...modal, isOpen: false })}
                {...modal}
            />
        </>
    )
}

interface ItemProps {
    label: string
    user?: UserShort
    handleClick: () => void
    isLoading?: boolean
    canEdit?: boolean
}

const Item = ({ label, user, handleClick, isLoading, canEdit }: ItemProps) => (
    <div className="mt-3 pb-2 border-b border-pzh-gray-400">
        <Text type="body-bold">{label}</Text>
        <div className="flex items-center justify-between">
            {!isLoading ? (
                <Text className={!user ? 'text-pzh-gray-600' : ''}>
                    {user?.Gebruikersnaam || 'Niet geselecteerd'}
                </Text>
            ) : (
                <div className="w-[50%]">
                    <LoaderCard height="30" mb="0" />
                </div>
            )}
            {canEdit &&
                (isLoading ? (
                    <Spinner
                        size={14}
                        className="animate-spin text-pzh-gray-600"
                    />
                ) : !user ? (
                    <button aria-label="Toevoegen" onClick={handleClick}>
                        <div className="w-4 h-4 bg-pzh-green rounded-full flex items-center justify-center">
                            <Plus size={14} className="text-pzh-white" />
                        </div>
                    </button>
                ) : (
                    <button aria-label="Wijzigen" onClick={handleClick}>
                        <PenToSquare size={20} className="text-pzh-green" />
                    </button>
                ))}
        </div>
    </div>
)

export default ObjectDefaultInfo
