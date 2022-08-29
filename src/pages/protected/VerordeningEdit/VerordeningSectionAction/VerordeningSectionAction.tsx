import { Button, Heading, Modal, Notification } from '@pzh-ui/components'
import { Bars, Spinner } from '@pzh-ui/icons'
import { DragControls } from 'framer-motion'
import React, { useState } from 'react'
import { useQueryClient } from 'react-query'

import ButtonDropdown from '@/components/ButtonDropdown'
import Dropdown from '@/components/Dropdown'
import { VerordeningStructureChild } from '@/types/verordening'
import { patchOrPostSectionInVerordening } from '@/utils/verordening'

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
                'getVerordeningStructuur',
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
            <ConfirmDeletion
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

interface ConfirmDeletionProps {
    show: boolean
    togglePopup: () => void
    removeSection: () => void
    section: VerordeningStructureChild
}

const ConfirmDeletion = ({
    show,
    togglePopup,
    removeSection,
    section,
}: ConfirmDeletionProps) => (
    <Modal
        maxWidth="max-w-sm"
        open={show}
        onClose={togglePopup}
        closeButton
        ariaLabel="Wachtwoord vergeten">
        <Heading level="3">
            Verwijder {section.Type} {section.Volgnummer}
        </Heading>

        <p className="py-1 text-pzh-blue-dark">
            Je staat op het punt om paragraaf 1 te verwijderen.{' '}
            {section.Children.length > 0 && (
                <div>
                    Op dit moment{' '}
                    {section.Children.length > 1
                        ? `vallen er ${section.Children.length} onderdelen`
                        : 'valt  er 1 onderdeel onder.'}{' '}
                    Je kunt pas {section.Type} {section.Volgnummer} verwijderen
                    zodra{' '}
                    {section.Children.length > 1
                        ? `de onderliggende
                        onderdelen verwijderd zijn.`
                        : 'het onderliggende onderdeel verwijderd is.'}{' '}
                </div>
            )}
        </p>
        <div className="flex items-center justify-between mt-5">
            <button
                className="text-sm underline transition-colors cursor-pointer text-pzh-blue hover:text-pzh-blue-dark"
                onClick={togglePopup}
                id="close-password-forget-popup"
                data-testid="close-password-forget-popup">
                Annuleren
            </button>
            <Button
                label={`Verwijder ${section.Type}`}
                variant="cta"
                id="wachtwoord-reset-button-mailto"
                data-testid="wachtwoord-reset-button-mailto"
                disabled={section.Children.length > 0}
                onClick={e => {
                    e.preventDefault()
                    removeSection()
                    togglePopup()
                }}
            />
        </div>
    </Modal>
)

export default VerordeningSectionAction
