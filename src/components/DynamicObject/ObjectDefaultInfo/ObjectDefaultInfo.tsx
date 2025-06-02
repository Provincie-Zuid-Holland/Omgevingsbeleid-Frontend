import { Heading, Text } from '@pzh-ui/components'
import { useMemo } from 'react'

import { UserShort } from '@/api/fetchers.schemas'
import { LoaderCard } from '@/components/Loader'
import ObjectPersonModal from '@/components/Modals/ObjectModals/ObjectPersonModal'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import useUserInfo from '@/hooks/useUserInfo'
import useModalStore from '@/store/modalStore'
import {
    getStaticDataLabel,
    getStaticDataPropertyKey,
} from '@/utils/dynamicObject'

interface ObjectDefaultInfoProps {
    model: Model
}

const ObjectDefaultInfo = ({ model }: ObjectDefaultInfoProps) => {
    const { canCreateModule, canPatchObjectInModule } = usePermissions()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const { staticData } = model

    const { data: object, isLoading, isOwner, isClient } = useObject()
    const data = useMemo(() => object?.ObjectStatics, [object?.ObjectStatics])

    if (!!!staticData?.length) return null

    return (
        <>
            <div>
                <div className="mb-6 flex items-center justify-between">
                    <Heading level="3" size="m">
                        Algemene informatie
                    </Heading>
                    {((canPatchObjectInModule && (isOwner || isClient)) ||
                        canCreateModule) && (
                        <button
                            onClick={() =>
                                setActiveModal('objectGeneralInformation')
                            }
                            className="text-pzh-green underline hover:text-pzh-green-dark">
                            Wijzigen
                        </button>
                    )}
                </div>

                {staticData.map(item => {
                    const label = getStaticDataLabel(item)
                    const key = getStaticDataPropertyKey(item)
                    const user = data?.[key]

                    return (
                        <Item
                            key={item}
                            label={label}
                            user={user}
                            isLoading={isLoading}
                        />
                    )
                })}
            </div>

            <ObjectPersonModal model={model} />
        </>
    )
}

interface ItemProps {
    label: string
    user?: UserShort | null
    isLoading?: boolean
}

const Item = ({ label, user: providedUser, isLoading }: ItemProps) => {
    const user = useUserInfo(providedUser?.UUID ?? '')

    return (
        <div className="mt-3 border-b border-pzh-gray-300 pb-2">
            <Text bold color="text-pzh-blue-500">
                {label}
            </Text>
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
            </div>
        </div>
    )
}

export default ObjectDefaultInfo
