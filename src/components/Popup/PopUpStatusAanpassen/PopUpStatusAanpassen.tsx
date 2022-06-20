import { useState } from 'react'
import { toast } from 'react-toastify'

import VOLGENDE_STATUS from '@/constants/beleidskeuzeStatusAanpassen'

import PopUpAnimatedContainer from '../PopUpAnimatedContainer'

/**
 * Displays a popup in which a user can edit the status.
 *
 * @param {object} dataObject - Contains the data in object form.
 * @param {function} patchStatus - Function that is set in the parent state.
 * @param {string} status - Contains a status in text form.
 * @param {function} toggleStatusPopup - Function that is used to toggle the StatusPopup.
 */

interface PopUpStatusAanpassenProps {
    dataObject: any
    status: string
    patchStatus: (dataObject: any, value: string) => void
    toggleStatusPopup: () => void
}

function PopUpStatusAanpassen({
    dataObject,
    status,
    patchStatus,
    toggleStatusPopup,
}: PopUpStatusAanpassenProps) {
    const [selectValue, setSelect] = useState('')

    return (
        <PopUpAnimatedContainer small={true}>
            <div id="popup-edit-status" className="text-gray-800">
                <h2 className="mb-4 font-bold">Status aanpassen</h2>
                <div className="relative inline-block w-64">
                    <select
                        required
                        onChange={event => setSelect(event.target.value)}
                        value={selectValue}
                        name={'Status'}
                        className="block w-full px-4 py-3 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none hover:border-gray-500 focus:border-gray-500">
                        <option disabled value="">
                            {' '}
                            - selecteer een optie -{' '}
                        </option>
                        {VOLGENDE_STATUS[status as keyof typeof VOLGENDE_STATUS]
                            ? VOLGENDE_STATUS[
                                  status as keyof typeof VOLGENDE_STATUS
                              ].map((arrayItem, index) => (
                                  <option key={index} value={arrayItem}>
                                      {arrayItem}
                                  </option>
                              ))
                            : null}
                    </select>
                </div>
                <div className="flex items-center justify-between mt-5 text-sm">
                    <div
                        className="text-gray-600 underline cursor-pointer hover:text-gray-800 pzh-transition-colors"
                        onClick={toggleStatusPopup}>
                        Annuleren
                    </div>
                    <div
                        className={`bg-pzh-green pzh-transition-colors px-8 py-2 text-white rounded font-bold ${
                            selectValue !== ''
                                ? 'cursor-pointer hover:bg-pzh-green-dark'
                                : 'cursor-not-allowed'
                        }`}
                        onClick={() => {
                            if (selectValue !== '') {
                                patchStatus(dataObject, selectValue)
                                toggleStatusPopup()
                            } else {
                                toast('Selecteer eerst een nieuwe status')
                            }
                        }}>
                        Aanpassen
                    </div>
                </div>
            </div>
        </PopUpAnimatedContainer>
    )
}

export default PopUpStatusAanpassen
