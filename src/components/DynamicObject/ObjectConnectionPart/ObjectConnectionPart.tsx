import { PenToSquare, Plus, Spinner } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { ReadRelation } from '@/api/fetchers.schemas'
import Indicator from '@/components/Indicator'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import { Model } from '@/config/objects/types'
import useModalStore from '@/store/modalStore'

interface ObjectConnectionPartProps {
    /** Model of relation */
    model: Model
    /** Connections */
    connections?: ReadRelation[]
    /** Set state of modal */
    setModal: (state: ObjectConnectionModalActions) => void
    /** Is data loading */
    isLoading?: boolean
    /** User can edit connection */
    canEdit?: boolean
}

const ObjectConnectionPart = ({
    model,
    connections,
    setModal,
    isLoading,
    canEdit,
}: ObjectConnectionPartProps) => {
    const setActiveModal = useModalStore(state => state.setActiveModal)

    const handleButtonClick = (amount?: number) => {
        setModal({
            connectionKey: model.defaults.singular,
            initialStep: amount === 0 ? 2 : 1,
            initialValues: (model.defaults.atemporal
                ? {
                      Object_ID: 0,
                      items: connections?.map(({ Object_ID, Title }) => ({
                          Object_ID,
                          Title,
                      })),
                  }
                : {
                      Object_Type: model.defaults.singular,
                      Object_ID: undefined,
                  }) as Partial<ReadRelation>,
            connectionModel: model,
        })
        setActiveModal('objectAddConnection')
    }

    /**
     * Get amount of connections
     */
    const amount = useMemo(
        () => Object.values(connections || {}).length,
        [connections]
    )

    return (
        <div className="border-pzh-gray-300 relative mt-4 flex items-center justify-between border-b pb-4">
            <div className="flex items-center">
                <Indicator amount={amount} />
                <span className="ml-3">{model.defaults.pluralCapitalize}</span>
            </div>

            <button
                data-testid={
                    amount === 0
                        ? 'object-connection-add'
                        : 'object-connection-edit'
                }
                type="button"
                onClick={() => handleButtonClick(amount)}
                disabled={!canEdit}
                aria-label={amount === 0 ? 'Toevoegen' : 'Wijzigen'}
                className="after:content-[' '] after:absolute after:top-0 after:left-0 after:h-full after:w-full">
                {canEdit &&
                    (isLoading ? (
                        <Spinner
                            size={14}
                            className="text-pzh-gray-600 animate-spin"
                        />
                    ) : amount === 0 ? (
                        <div className="bg-pzh-green-500 flex h-[18px] w-[18px] items-center justify-center rounded-full">
                            <Plus size={14} className="text-pzh-white" />
                        </div>
                    ) : (
                        <PenToSquare size={18} className="text-pzh-green-500" />
                    ))}
            </button>
        </div>
    )
}

export default ObjectConnectionPart
