import { useMemo } from 'react'

import { PenToSquare, Plus, Spinner } from '@pzh-ui/icons'

import { ReadRelation } from '@/api/fetchers.schemas'
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
                      items: connections?.map(({ Object_ID, Title }) => ({
                          Object_ID,
                          Title,
                      })),
                  }
                : {
                      Object_Type: model.defaults.singular,
                  }) as ReadRelation,
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
        <div className="relative mt-3 flex items-center justify-between border-b border-pzh-gray-300 pb-4">
            <div className="flex items-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pzh-blue-light/50 text-pzh-blue">
                    <span className="-mb-1 text-s font-bold">{amount}</span>
                </div>
                <span className="-mb-1 ml-3">
                    {model.defaults.pluralCapitalize}
                </span>
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
                className="after:content-[' '] after:absolute after:left-0 after:top-0 after:h-full after:w-full">
                {canEdit &&
                    (isLoading ? (
                        <Spinner
                            size={14}
                            className="animate-spin text-pzh-gray-600"
                        />
                    ) : amount === 0 ? (
                        <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-pzh-green">
                            <Plus size={14} className="text-pzh-white" />
                        </div>
                    ) : (
                        <PenToSquare size={18} className="text-pzh-green" />
                    ))}
            </button>
        </div>
    )
}

export default ObjectConnectionPart
