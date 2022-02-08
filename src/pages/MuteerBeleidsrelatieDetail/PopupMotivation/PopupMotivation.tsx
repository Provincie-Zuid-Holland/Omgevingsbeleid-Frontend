import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'
import { useClickAway, useKey } from 'react-use'

import { BeleidsrelatiesRead } from '@/api/fetchers.schemas'
import { PopUpAnimatedContainer } from '@/components/Popup'

/**
 *
 * @param {object} props
 * @prop {string} props.motivationPopUp - contains the UUID of a beleidsrelatie
 * @prop {function} props.setMotivationPopUp - takes a UUID and set it in parent state in motivationPopUp
 * @param {object} props.relatie - Contains the relation object we want to display the motivation of
 * @returns Component that displays a animated popup containing the motivation for a relation
 */

interface PopupMotivationProps {
    motivationPopUp?: string | null
    setMotivationPopUp: (UUID?: string | null) => void
    relatie: BeleidsrelatiesRead
}

function PopupMotivation({
    motivationPopUp,
    setMotivationPopUp,
    relatie,
}: PopupMotivationProps) {
    const popupContainer = useRef(null)

    useClickAway(popupContainer, () => {
        setMotivationPopUp(null)
    })

    useKey('Escape', () => setMotivationPopUp(null))

    if (relatie.UUID !== motivationPopUp) return null

    return (
        <PopUpAnimatedContainer reference={popupContainer} small>
            <div
                onClick={() => setMotivationPopUp(null)}
                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                id={`sluit-popup-beleidsrelatie-motivering`}
                data-testid={`sluit-popup-beleidsrelatie-motivering`}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <h3 className="font-bold form-field-label">Motivering</h3>
            <p
                className={`form-field-description ${
                    relatie.Omschrijving ? '' : 'opacity-75'
                }`}>
                {relatie.Omschrijving
                    ? relatie.Omschrijving
                    : 'Deze relatie heeft geen motivering'}
            </p>
        </PopUpAnimatedContainer>
    )
}

export default PopupMotivation
