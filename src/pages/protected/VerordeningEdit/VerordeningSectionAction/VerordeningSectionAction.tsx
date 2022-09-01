import { Bars, Spinner } from '@pzh-ui/icons'
import { DragControls } from 'framer-motion'
import { useState } from 'react'
import { useQueryClient } from 'react-query'

import ButtonDropdown from '@/components/ButtonDropdown'
import Dropdown from '@/components/Dropdown'
import { VerordeningStructureChild } from '@/types/verordening'
import { patchOrPostSectionInVerordening } from '@/utils/verordening'

import VerordeningConfirmDeletion from '../VerordeningConfirmDeletion'
import { useVerordening } from '../verordeningEditContext'

export interface VerordeningSectionActionProps {
    section: VerordeningStructureChild
    currentIndexPath: number[]
    controls: DragControls
}

const VerordeningSectionAction = ({
    section,
    currentIndexPath,
    controls,
}: VerordeningSectionActionProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const { state, dispatch } = useVerordening()
    const queryClient = useQueryClient()
    const {
        editingSectionUUID,
        isLoadingOrSaving,
        isEditingOrder,
        lineageClone,
    } = state

    const dropdownItems = [
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
            callback: () => setShowConfirmDelete(true),
        },
    ]

    const removeSection = async () => {
        try {
            dispatch({
                type: 'setIsLoadingOrSaving',
                payload: true,
            })

            setIsRemoving(true)

            const patchedVerordening = await patchOrPostSectionInVerordening(
                section,
                null,
                currentIndexPath,
                lineageClone!,
                'delete'
            )

            queryClient.setQueryData(
                `getVerordeningStructuur/${patchedVerordening.ID}`,
                patchedVerordening
            )

            dispatch({
                type: 'setIsLoadingOrSaving',
                payload: false,
            })
        } catch (error) {
            setIsRemoving(false)

            dispatch({
                type: 'setIsLoadingOrSaving',
                payload: false,
            })

            console.error(error)
        }
    }

    return (
        <div className="relative">
            <VerordeningConfirmDeletion
                section={section}
                show={showConfirmDelete}
                removeSection={removeSection}
                togglePopup={() => setShowConfirmDelete(!showConfirmDelete)}
            />
            {(isLoadingOrSaving && editingSectionUUID === section.UUID) ||
            isRemoving ? (
                <div className="p-3 mr-2 rounded-md cursor-not-allowed hover:bg-pzh-gray-100 reorder-handle">
                    <Spinner className="animate-spin" />
                </div>
            ) : !isEditingOrder ? (
                <ButtonDropdown
                    toggle={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Dropdown
                        isOpen={isDropdownOpen}
                        setIsOpen={setIsDropdownOpen}
                        className="right-0"
                        items={dropdownItems}
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
