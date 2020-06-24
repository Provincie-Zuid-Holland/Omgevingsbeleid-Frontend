import React from 'react'
import { faEllipsisH, faSpinner } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Transition from './../../../components/Transition'

import useClickOutsideContainer from './../../../utils/useClickOutsideContainer'
import useCloseWithEscapeKey from './../../../utils/useCloseWithEscapeKey'

import VerordeningContext from './../VerordeningContext'

const CrudDropdown = ({ item, pathToIndex }) => {
    const {
        verordeningsObjectIsLoading,
        verordeningsObjectFromGET,
        setUUIDBeingEdited,
        setIndexArrayToUUIDBeingEdited,
        UUIDBeingEdited,
        setVolgnummerBeingEdited,
    } = React.useContext(VerordeningContext)

    const [isOpen, setIsOpen] = React.useState(false)
    const dropdownRef = React.useRef(null)

    useClickOutsideContainer(dropdownRef, () => {
        setIsOpen(false)
    })
    useCloseWithEscapeKey(dropdownRef, () => {
        setIsOpen(false)
    })

    if (verordeningsObjectIsLoading && UUIDBeingEdited !== item.UUID) {
        return null
    }

    return (
        <span
            className={`absolute inset-y-0 right-0 w-12 py-1 mr-2 cursor-pointer ${
                verordeningsObjectFromGET ? 'pointer-events-none' : ''
            }`}
        >
            {verordeningsObjectIsLoading ? (
                <span className="flex items-center justify-center w-12 h-full cursor-pointer">
                    <FontAwesomeIcon
                        className="text-gray-500 rotate-icon"
                        icon={faSpinner}
                    />
                </span>
            ) : !verordeningsObjectIsLoading && !verordeningsObjectFromGET ? (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-center w-12 h-full cursor-pointer"
                >
                    <FontAwesomeIcon icon={faEllipsisH} />
                </button>
            ) : null}

            <Transition
                show={isOpen}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95 -translate-y-5 transform"
                enterTo="opacity-100 scale-100 translate-y-0 transform"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100 translate-y-0 transform"
                leaveTo="opacity-0 scale-95 -translate-y-5 transform"
            >
                <div
                    ref={dropdownRef}
                    className="absolute right-0 z-10 w-56 mt-2 -mt-5 origin-top-right rounded-md shadow-lg"
                >
                    <div className="bg-white rounded-md shadow-xs">
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    console.log('CLICKED')
                                    console.log(pathToIndex)
                                    setIsOpen(false)
                                    setIndexArrayToUUIDBeingEdited(pathToIndex)
                                    setVolgnummerBeingEdited(item.Volgnummer)
                                    setUUIDBeingEdited(item.UUID)
                                }}
                                className="block w-full px-4 py-2 text-sm font-semibold leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                            >
                                Wijzigen
                            </button>
                            <button
                                onClick={() => {
                                    window.confirm(
                                        `Weet u zeker dat u dit ${item.Type} wilt verwijderen?`
                                    )
                                    setIsOpen(false)
                                }}
                                className="block w-full px-4 py-2 text-sm font-semibold leading-5 text-left text-red-700 hover:bg-gray-100 hover:text-red-800 focus:bg-gray-100 focus:text-red-900"
                            >
                                Verwijderen
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </span>
    )
}

export default CrudDropdown
