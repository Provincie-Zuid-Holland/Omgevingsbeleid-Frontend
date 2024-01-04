import { Heading, Text } from '@pzh-ui/components'
import { PenToSquare, Plus, Spinner } from '@pzh-ui/icons'
import { useMemo, useState } from 'react'

import { UserShort } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import ObjectPersonModal from '@/components/Modals/ObjectModals/ObjectPersonModal'
import { ObjectPersonModalActions } from '@/components/Modals/ObjectModals/types'
import { Model, ModelPatchStaticType } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'
import {
    getStaticDataFilterProperty,
    getStaticDataFilterRoles,
    getStaticDataLabel,
    getStaticDataPropertyKey,
    getStaticDataPropertyRequired,
} from '@/utils/dynamicObject'

interface ObjectDefaultInfoProps {
    model: Model
}

const ObjectDefaultInfo = ({ model }: ObjectDefaultInfoProps) => {
    const { canCreateModule, canPatchObjectInModule } = usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [modal, setModal] = useState<ObjectPersonModalActions>({
        initialValues: {} as ModelPatchStaticType,
    })

    const { staticData } = model

    const { data: object, isLoading, isOwner, isClient } = useObject()
    const data = useMemo(() => object?.ObjectStatics, [object?.ObjectStatics])

    /**
     * Handle item click
     */
    const handleClick = (person: ObjectPersonModalActions['person']) => {
        setModal({
            ...modal,
            person,
        })
        setActiveModal('objectPerson')
    }

    if (!!!staticData?.length) return null

    return (
        <>
            <div>
                <Heading level="3" size="m" className="mb-4">
                    Algemene informatie
                </Heading>

                {staticData.map(item => {
                    const label = getStaticDataLabel(item)
                    const key = getStaticDataPropertyKey(item)
                    const required = getStaticDataPropertyRequired(item)
                    const filterProperty = getStaticDataFilterProperty(item)
                    const filterRoles = getStaticDataFilterRoles(item)
                    const user = data?.[key]

                    const filter =
                        filterProperty && data?.[filterProperty]?.UUID

                    return (
                        <Item
                            key={item}
                            label={label}
                            user={user}
                            handleClick={() =>
                                handleClick({
                                    key: item,
                                    label,
                                    value: user,
                                    required,
                                    filter,
                                    filterRoles,
                                })
                            }
                            isLoading={isLoading}
                            canEdit={
                                (canPatchObjectInModule &&
                                    (isOwner || isClient)) ||
                                canCreateModule
                            }
                        />
                    )
                })}
            </div>

            <ObjectPersonModal {...modal} />
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
    <div className="mt-3 border-b border-pzh-gray-300 pb-2">
        <Text bold>{label}</Text>
        <div className="relative flex items-center justify-between">
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
                    <button
                        type="button"
                        data-testid="object-person-add"
                        aria-label={`${label} toevoegen`}
                        onClick={handleClick}
                        className="after:content-[' '] after:absolute after:left-0 after:top-0 after:h-full after:w-full">
                        <div className="size-[18px] flex items-center justify-center rounded-full bg-pzh-green">
                            <Plus size={14} className="text-pzh-white" />
                        </div>
                    </button>
                ) : (
                    <button
                        type="button"
                        data-testid="object-person-edit"
                        aria-label={`${label} wijzigen`}
                        onClick={handleClick}
                        className="after:content-[' '] after:absolute after:left-0 after:top-0 after:h-full after:w-full">
                        <PenToSquare size={18} className="text-pzh-green" />
                    </button>
                ))}
        </div>
    </div>
)

export default ObjectDefaultInfo
