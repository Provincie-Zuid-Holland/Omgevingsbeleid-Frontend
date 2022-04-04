import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'

import { PopUpAnimatedContainer } from '@/components/Popup'

/**
 * @returns Component where a user can edit an existing connection
 */

interface PopUpBewerkKoppelingProps {
    bewerkItem: any
    togglePopup: () => void
    titelMainObject: string
    verwijderKoppelingRelatie: (bewerkItem: any, propertyName: string) => void
    wijzigKoppelingRelatie: (
        bewerkItem: any,
        description: string,
        propertyName: string
    ) => void
}

const PopUpBewerkKoppeling = ({
    bewerkItem,
    togglePopup,
    titelMainObject,
    verwijderKoppelingRelatie,
    wijzigKoppelingRelatie,
}: PopUpBewerkKoppelingProps) => {
    const [description, setDescription] = useState(
        bewerkItem.item.Koppeling_Omschrijving || ''
    )

    return (
        <PopUpAnimatedContainer>
            <div
                onClick={togglePopup}
                className="absolute top-0 right-0 px-6 py-4 text-gray-600 cursor-pointer"
                id={`form-field-koppeling-sluit-popup`}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
            <h3 className="font-bold form-field-label">koppelen</h3>

            <p className="form-field-description">
                Beschrijf de koppeling tussen &apos;
                {bewerkItem.item.Object.Titel}&apos; en de beleidskeuze &apos;
                {titelMainObject}&apos;
            </p>
            <p className="mt-4 form-field-description">
                Beschrijf zo concreet mogelijk de relatie
            </p>
            <textarea
                id={`form-field-koppeling-beschrijving`}
                value={description}
                required
                onChange={e => setDescription(e.target.value)}
                name="omschrijving"
                className="block w-full h-24 px-4 py-3 leading-tight text-gray-700 border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white hover:border-gray-500 focus:border-gray-500"
            />
            <div className="flex items-center justify-between mt-6">
                <div>
                    <span
                        tabIndex={0}
                        className="text-sm text-gray-600 underline cursor-pointer"
                        onClick={togglePopup}
                        id="form-field-koppeling-annuleren">
                        Annuleren
                    </span>
                    <span
                        tabIndex={0}
                        className="ml-4 text-sm text-red-600 underline cursor-pointer"
                        id="form-field-koppeling-verwijderen"
                        onClick={() => {
                            verwijderKoppelingRelatie(
                                bewerkItem,
                                bewerkItem.propertyName
                            )
                            togglePopup()
                        }}>
                        Verwijderen
                    </span>
                </div>

                <div
                    className={`font-bold py-2 px-4 cursor-pointer leading-tight text-sm rounded bg-pzh-green text-white ${
                        description.length === 0
                            ? `cursor-not-allowed opacity-50`
                            : `hover:underline`
                    }`}
                    tabIndex={0}
                    onClick={() => {
                        if (description.length > 0) {
                            wijzigKoppelingRelatie(
                                bewerkItem,
                                description,
                                bewerkItem.propertyName
                            )
                            togglePopup()
                        } else {
                            return
                        }
                    }}
                    onKeyPress={e => {
                        if (e.key === 'Enter' && description.length > 0) {
                            wijzigKoppelingRelatie(
                                bewerkItem,
                                description,
                                bewerkItem.propertyName
                            )
                            togglePopup()
                        }
                    }}
                    id="form-field-koppeling-wijzigen">
                    Wijzigen
                </div>
            </div>
        </PopUpAnimatedContainer>
    )
}

export default PopUpBewerkKoppeling
