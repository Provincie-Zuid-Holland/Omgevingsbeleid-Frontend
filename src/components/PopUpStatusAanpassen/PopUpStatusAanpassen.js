import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

import PopUpAnimatedContainer from './../PopUpAnimatedContainer'

import VOLGENDE_STATUS from './../../constants/beleidsbeslissingStatusAanpassen'

function PopUpStatusAanpassen({
    dataObject,
    status,
    patchStatus,
    toggleStatusPopup,
}) {
    const [selectValue, setSelect] = useState('')

    return (
        <PopUpAnimatedContainer small={true}>
            <div id="popup-edit-status" className="text-gray-800">
                <h2 className="mb-4 font-bold">Status aanpassen</h2>
                <div className="relative inline-block w-64">
                    <select
                        required
                        onChange={(event) => setSelect(event.target.value)}
                        value={selectValue}
                        name={'Status'}
                        className="block w-full px-4 py-3 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500"
                    >
                        <option disabled value="">
                            {' '}
                            - selecteer een optie -{' '}
                        </option>
                        {VOLGENDE_STATUS[status]
                            ? VOLGENDE_STATUS[status].map(
                                  (arrayItem, index) => {
                                      return (
                                          <option key={index} value={arrayItem}>
                                              {arrayItem}
                                          </option>
                                      )
                                  }
                              )
                            : null}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                        <svg
                            className="w-4 h-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
                <div className="flex items-center justify-between mt-5 text-sm">
                    <div
                        className="text-gray-600 underline cursor-pointer"
                        onClick={toggleStatusPopup}
                    >
                        Annuleren
                    </div>
                    <div
                        className={`bg-green-500 px-8 py-2 text-white rounded font-semibold ${
                            selectValue !== ''
                                ? 'cursor-pointer'
                                : 'cursor-not-allowed'
                        }`}
                        onClick={() => {
                            if (selectValue !== '') {
                                patchStatus(dataObject, selectValue)
                                toggleStatusPopup()
                            } else {
                                toast('Selecteer eerst een nieuwe status')
                            }
                        }}
                    >
                        Aanpassen
                    </div>
                </div>
            </div>
        </PopUpAnimatedContainer>
    )
}

PopUpStatusAanpassen.propTypes = {
    status: PropTypes.oneOf([
        'Ontwerp GS Concept',
        'Ontwerp GS',
        'Ontwerp PS',
        'Ontwerp in inspraak',
        'Definitief ontwerp GS concept',
        'Definitief ontwerp GS',
        'Definitief ontwerp PS',
        'Vastgesteld',
        'Datum vastgesteld - Later toevoegen',
        'Vigerend',
        'Vigerend gearchiveerd',
        'Gepubliceerd',
        'Niet-Actief',
        'Uitgecheckt',
    ]),
}

export default PopUpStatusAanpassen
