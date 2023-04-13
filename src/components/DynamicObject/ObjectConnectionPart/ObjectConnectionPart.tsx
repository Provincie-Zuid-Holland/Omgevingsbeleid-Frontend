import { PenToSquare, Plus, Spinner } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { RelationShort } from '@/api/fetchers.schemas'
import { ObjectConnectionModalActions } from '@/components/Modals/ObjectModals/types'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'

import { Connection } from '../ObjectConnections/ObjectConnections'

interface ObjectConnectionPartProps {
    /** Key of connection */
    connectionKey?: keyof ModelReturnType
    /** Model of relation */
    model: Model
    /** Key of object */
    connections?: Connection[]
    /** Set state of modal */
    setModal: (state: ObjectConnectionModalActions) => void
    /** Is data loading */
    isLoading?: boolean
    /** User can edit connection */
    canEdit?: boolean
}

const ObjectConnectionPart = ({
    connectionKey,
    model,
    connections,
    setModal,
    isLoading,
    canEdit,
}: ObjectConnectionPartProps) => {
    const handleButtonClick = (amount?: number) => {
        setModal({
            connectionKey,
            initialStep: amount === 0 ? 2 : 1,
            initialValues: {
                Object_Type: model.defaults.singular,
            } as RelationShort,
            isOpen: true,
            connectionModel: models[model.defaults.singular as ModelType],
        })
    }

    /**
     * Get amount of connections
     */
    const amount = useMemo(
        () => Object.values(connections || {}).length,
        [connections]
    )

    return (
        <div className="relative flex justify-between items-center mt-3 pb-4 border-b border-pzh-gray-300">
            <div className="flex items-center">
                <div className="flex justify-center items-center h-[24px] w-[24px] rounded-full bg-pzh-blue-light/50 text-pzh-blue">
                    <span className="-mb-[4px] text-[16px] font-bold">
                        {amount}
                    </span>
                </div>
                <span className="-mb-[4px] ml-3">
                    {model.defaults.pluralCapitalize}
                </span>
            </div>

            <button
                type="button"
                onClick={() => handleButtonClick(amount)}
                aria-label={amount === 0 ? 'Toevoegen' : 'Wijzigen'}
                className="after:content-[' '] after:absolute after:left-0 after:top-0 after:w-full after:h-full">
                {canEdit &&
                    (isLoading ? (
                        <Spinner
                            size={14}
                            className="text-pzh-gray-600 animate-spin"
                        />
                    ) : amount === 0 ? (
                        <div className="w-[18px] h-[18px] bg-pzh-green rounded-full flex items-center justify-center">
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
