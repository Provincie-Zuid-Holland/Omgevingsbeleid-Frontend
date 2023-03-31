import { PenToSquare, Plus } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { RelationShort } from '@/api/fetchers.schemas'
import * as models from '@/config/objects'
import { Model, ModelReturnType, ModelType } from '@/config/objects/types'

import { ObjectConnectionModalActions } from '../../Modals/ObjectModals/types'
import { Relation } from '../ObjectRelations/ObjectRelations'

interface ObjectRelationPartProps {
    /** Key of connection */
    connectionKey?: keyof ModelReturnType
    /** Model of relation */
    model: Model
    /** Key of object */
    relations?: Relation[]
    /** Set state of modal */
    setModal: (state: ObjectConnectionModalActions) => void
}

const ObjectRelationPart = ({
    connectionKey,
    model,
    relations,
    setModal,
}: ObjectRelationPartProps) => {
    const handleButtonClick = (amount?: number) => {
        setModal({
            connectionKey,
            initialStep: amount === 0 ? 2 : 1,
            initialValues: {
                Object_Type: model.defaults.singular,
            } as RelationShort,
            isOpen: true,
            relationModel: models[model.defaults.singular as ModelType],
        })
    }

    /**
     * Get amount of relations
     */
    const amount = useMemo(
        () => Object.values(relations || {}).length,
        [relations]
    )

    return (
        <div className="flex justify-between items-center py-2 border-b border-pzh-gray-400">
            <div className="flex items-center">
                <div className="flex justify-center items-center h-[24px] w-[24px] rounded-full bg-pzh-blue-light text-pzh-white">
                    <span className="-mb-[4px] text-[16px] font-bold">
                        {amount}
                    </span>
                </div>
                <span className="-mb-[4px] ml-3 truncate">
                    {model.defaults.pluralCapitalize}
                </span>
            </div>

            <button
                type="button"
                onClick={() => handleButtonClick(amount)}
                aria-label={amount === 0 ? 'Toevoegen' : 'Wijzigen'}>
                {amount === 0 ? (
                    <div className="w-4 h-4 bg-pzh-green rounded-full flex items-center justify-center">
                        <Plus size={14} className="text-pzh-white" />
                    </div>
                ) : (
                    <PenToSquare size={20} className="text-pzh-green" />
                )}
            </button>
        </div>
    )
}

export default ObjectRelationPart
