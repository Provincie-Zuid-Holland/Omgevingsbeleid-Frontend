import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'

import PopUpAnimatedContainer from '../../../components/PopUpAnimatedContainer'
import useClickOutsideContainer from './../../../utils/useClickOutsideContainer'
import useCloseWithEscapeKey from './../../../utils/useCloseWithEscapeKey'

/**
 *
 * @param {object} props
 * @prop {string} props.motivationPopUp - contains the UUID of a beleidsrelatie
 * @prop {function} props.setMotivationPopUp - takes a UUID and set it in parent state in motivationPopUp
 * @param {object} props.relatie - Contains the relation object we want to display the motivation of
 * @returns Component that displays a animated popup containing the motivation for a relation
 */
function PopupMotivation({ motivationPopUp, setMotivationPopUp, relatie }) {
    const popupContainer = useRef(null)

    useClickOutsideContainer(popupContainer, () => {
        setMotivationPopUp(null)
    })

    useCloseWithEscapeKey(popupContainer, () => {
        setMotivationPopUp(null)
    })

    if (relatie.UUID !== motivationPopUp) return null

    return (
        <PopUpAnimatedContainer reference={popupContainer} small={true}>
            <div
                onClick={() => setMotivationPopUp(null)}
                className="absolute top-0 right-0 px-3 py-2 text-gray-600 cursor-pointer"
                id={`sluit-popup-beleidsrelatie-motivering`}>
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
