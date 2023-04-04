import { getHeadingStyles, Text } from '@pzh-ui/components'
import { PenToSquare, Plus } from '@pzh-ui/icons'
import { useState } from 'react'

import { Model, ModelPatchStaticType } from '@/config/objects/types'
import useBreakpoint from '@/hooks/useBreakpoint'
import getStaticDataLabel from '@/utils/getStaticDataLabel'

import ObjectPersonModal from '../../Modals/ObjectModals/ObjectPersonModal'
import { ObjectPersonModalActions } from '../../Modals/ObjectModals/types'

interface ObjectDefaultInfoProps {
    model: Model
}

const ObjectDefaultInfo = ({ model }: ObjectDefaultInfoProps) => {
    const { isMobile } = useBreakpoint()

    const [modal, setModal] = useState<ObjectPersonModalActions>({
        isOpen: false,
        initialValues: {} as ModelPatchStaticType,
    })

    const { staticData } = model

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

                    return (
                        <Item
                            key={item}
                            label={label}
                            handleClick={() =>
                                handleClick({ key: item, label })
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
    value?: string
    handleClick: () => void
}

const Item = ({ label, value, handleClick }: ItemProps) => (
    <div className="mt-3 pb-2 border-b border-pzh-gray-400">
        <Text type="body-bold">{label}</Text>
        <div className="flex items-center justify-between">
            <Text className={!value ? 'text-pzh-gray-600' : ''}>
                {value || 'Niet geselecteerd'}
            </Text>
            {!value ? (
                <button aria-label="Toevoegen" onClick={handleClick}>
                    <div className="w-4 h-4 bg-pzh-green rounded-full flex items-center justify-center">
                        <Plus size={14} className="text-pzh-white" />
                    </div>
                </button>
            ) : (
                <button aria-label="Wijzigen" onClick={handleClick}>
                    <PenToSquare size={20} className="text-pzh-green" />
                </button>
            )}
        </div>
    </div>
)

export default ObjectDefaultInfo
