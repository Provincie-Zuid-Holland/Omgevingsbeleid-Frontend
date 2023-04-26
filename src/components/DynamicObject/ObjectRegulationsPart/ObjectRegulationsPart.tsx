import { PenToSquare, Plus, Spinner } from '@pzh-ui/icons'
import { useMemo } from 'react'

import { RegulationShort } from '@/api/fetchers.schemas'
import { RegulationModalActions } from '@/components/Modals/RegulationModal/types'

interface ObjectRegulationsPartProps {
    /** Connections */
    connections?: RegulationShort[]
    /** Set state of modal */
    setModal: (
        state: RegulationModalActions & { type: 'object' | 'regulation' }
    ) => void
    /** Is data loading */
    isLoading?: boolean
    /** User can edit connection */
    canEdit?: boolean
}

const ObjectRegulationsPart = ({
    connections,
    setModal,
    isLoading,
    canEdit,
}: ObjectRegulationsPartProps) => {
    const handleButtonClick = (amount?: number) => {
        setModal({
            type: 'regulation',
            initialValues: {
                items: connections?.map(({ UUID }) => UUID),
            },
            initialStep: amount === 0 ? 2 : 1,
            isOpen: true,
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
                    Nationale belangen en Wettelijke taken
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

export default ObjectRegulationsPart
