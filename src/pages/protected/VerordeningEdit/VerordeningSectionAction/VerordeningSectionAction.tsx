import { Bars, Spinner } from '@pzh-ui/icons'
import { DragControls } from 'framer-motion'
import React, { useState } from 'react'

import ButtonDropdown from '@/components/ButtonDropdown'
import Dropdown from '@/components/Dropdown'
import { VerordeningChildRead } from '@/types/verordening'

import { useVerordening } from '../verordeningEditContext'

export interface VerordeningSectionActionProps {
    section: VerordeningChildRead
    currentIndexPath: number[]
    controls: DragControls
}
const VerordeningSectionAction = ({
    section,
    currentIndexPath,
    controls,
}: VerordeningSectionActionProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const { state, dispatch } = useVerordening()
    const { editingSectionUUID, isLoadingOrSaving, isEditingOrder } = state
    return (
        <div className="relative">
            {isLoadingOrSaving && editingSectionUUID === section.UUID ? (
                <div className="p-3 mr-2 rounded-md cursor-not-allowed hover:bg-pzh-gray-100 reorder-handle">
                    <Spinner className="rotate-icon" />
                </div>
            ) : !isEditingOrder ? (
                <ButtonDropdown
                    toggle={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Dropdown
                        isOpen={isDropdownOpen}
                        setIsOpen={setIsDropdownOpen}
                        className="right-0"
                        items={[
                            {
                                text: 'Wijzigen',
                                callback: () => {
                                    dispatch({
                                        type: 'setEditingSectionUUID',
                                        payload: section.UUID,
                                    })
                                    dispatch({
                                        type: 'setEditingSectionIndexPath',
                                        payload: currentIndexPath,
                                    })
                                },
                            },
                            {
                                text: 'Verwijderen',
                                className: 'text-pzh-red',
                                callback: () => console.log('Delete'),
                            },
                        ]}
                    />
                </ButtonDropdown>
            ) : (
                <button
                    type="button"
                    name="reorder-section"
                    onPointerDown={e => {
                        e.preventDefault()
                        controls.start(e)
                    }}
                    className="p-3 mr-2 transition duration-150 ease-in rounded-md cursor-move hover:bg-pzh-gray-100">
                    <Bars />
                </button>
            )}
        </div>
    )
}
export default VerordeningSectionAction
