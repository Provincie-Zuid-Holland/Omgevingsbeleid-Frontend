import { useMemo, useState } from 'react'

import { PenToSquare, Plus } from '@pzh-ui/icons'

import Indicator from '@/components/Indicator'
import ObjectRelatedFilesModal from '@/components/Modals/ObjectModals/ObjectRelatedFilesModal'
import { ObjectRelatedFilesModalActions } from '@/components/Modals/ObjectModals/types'
import { Model } from '@/config/objects/types'
import useObject from '@/hooks/useObject'
import usePermissions from '@/hooks/usePermissions'
import useModalStore from '@/store/modalStore'

interface ObjectRelatedFilesProps {
    model: Model
}

const ObjectRelatedFiles = ({ model }: ObjectRelatedFilesProps) => {
    const { canCreateObjectRelatedFile } = usePermissions()
    const { isOwner, data: objectData } = useObject()

    const setActiveModal = useModalStore(state => state.setActiveModal)

    const [modal, setModal] = useState<ObjectRelatedFilesModalActions>({
        initialStep: 1,
    })

    const userCanEdit = useMemo(
        () => canCreateObjectRelatedFile || isOwner,
        [canCreateObjectRelatedFile, isOwner]
    )

    const amount = objectData?.Related_Files?.length ?? 0

    const handleButtonClick = () => {
        setModal({ initialStep: amount === 0 ? 2 : 1 })
        setActiveModal('objectRelatedFiles')
    }

    return (
        <>
            <div className="relative mt-4 flex items-center justify-between border-b border-pzh-gray-300 pb-4">
                <div className="flex items-center">
                    <Indicator amount={amount} />
                    <span className="ml-3">Gerelateerde bestanden</span>
                </div>

                <button
                    data-testid={
                        amount === 0
                            ? 'object-related-file-add'
                            : 'object-related-file-edit'
                    }
                    type="button"
                    onClick={handleButtonClick}
                    disabled={!userCanEdit}
                    aria-label={amount === 0 ? 'Toevoegen' : 'Wijzigen'}
                    className="after:content-[' '] after:absolute after:top-0 after:left-0 after:h-full after:w-full">
                    {userCanEdit &&
                        (amount === 0 ? (
                            <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-pzh-green-500">
                                <Plus size={14} className="text-pzh-white" />
                            </div>
                        ) : (
                            <PenToSquare
                                size={18}
                                className="text-pzh-green-500"
                            />
                        ))}
                </button>
            </div>

            <ObjectRelatedFilesModal model={model} {...modal} />
        </>
    )
}

export default ObjectRelatedFiles
