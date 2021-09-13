/* istanbul ignore file */
import React from "react"
import {
    faEllipsisH,
    faSpinner,
    faTimes,
} from "@fortawesome/pro-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Transition } from "@headlessui/react"

import useClickOutsideContainer from "./../../../utils/useClickOutsideContainer"
import useCloseWithEscapeKey from "./../../../utils/useCloseWithEscapeKey"

import VerordeningContext from "./../VerordeningContext"

const CrudDropdown = ({ item, pathToIndex }) => {
    const {
        verordeningsObjectIsLoading,
        verordeningsObjectFromGET,
        setUUIDBeingEdited,
        setIndexArrayToUUIDBeingEdited,
        UUIDBeingEdited,
        setVolgnummerBeingEdited,
        removeObject,
    } = React.useContext(VerordeningContext)

    const [isOpen, setIsOpen] = React.useState(false)
    const [deleteIsOpen, setDeleteIsOpen] = React.useState(false)
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
        <React.Fragment>
            <ConfirmDelete
                item={item}
                show={deleteIsOpen}
                setDeleteIsOpen={setDeleteIsOpen}
                deleteItem={() => removeObject(pathToIndex)}
            />
            <span
                className={`absolute inset-y-0 right-0 w-12 py-1 mr-2 cursor-pointer ${
                    verordeningsObjectFromGET ? "pointer-events-none" : ""
                }`}
            >
                {verordeningsObjectIsLoading ? (
                    <span className="flex items-center justify-center w-12 h-full cursor-pointer">
                        <FontAwesomeIcon
                            className="text-gray-500 rotate-icon"
                            icon={faSpinner}
                        />
                    </span>
                ) : !verordeningsObjectIsLoading &&
                  !verordeningsObjectFromGET ? (
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-center w-12 h-full cursor-pointer"
                    >
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>
                ) : null}

                <Transition
                    className="relative z-50"
                    show={isOpen}
                    enter="transition ease-out duration-100 transform z-50"
                    enterFrom="opacity-0 scale-95 -translate-y-5 transform"
                    enterTo="opacity-100 scale-100 translate-y-0 transform"
                    leave="duration-75"
                    leaveFrom=""
                    leaveTo=""
                >
                    <div
                        ref={dropdownRef}
                        className="absolute right-0 z-50 w-56 mt-2 overflow-y-hidden origin-top-right rounded-md shadow-lg"
                    >
                        <div className="bg-white rounded-md ring-1 ring-black ring-opacity-5">
                            <div className="py-1 overflow-y-hidden">
                                <button
                                    onClick={() => {
                                        setIsOpen(false)
                                        setIndexArrayToUUIDBeingEdited(
                                            pathToIndex
                                        )
                                        setVolgnummerBeingEdited(
                                            item.Volgnummer
                                        )
                                        setUUIDBeingEdited(item.UUID)
                                    }}
                                    className="block w-full px-4 py-2 text-sm font-bold leading-5 text-left text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900"
                                >
                                    Wijzigen
                                </button>
                                <button
                                    onClick={() => {
                                        if (item.Children) {
                                            setIsOpen(false)
                                            window.setTimeout(() => {
                                                setDeleteIsOpen(true)
                                            }, 150)
                                        }
                                    }}
                                    className="block w-full px-4 py-2 text-sm font-bold leading-5 text-left text-red-700 hover:bg-gray-100 hover:text-red-800 focus:bg-gray-100 focus:text-red-900"
                                >
                                    Verwijderen
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </span>
        </React.Fragment>
    )
}

const ConfirmDelete = ({ item, deleteItem, show, setDeleteIsOpen }) => {
    return (
        <div className="fixed inset-0 z-10 overflow-y-auto pointer-events-none">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center pointer-events-none sm:block sm:p-0">
                <Transition
                    show={show}
                    enter="ease-out duration-300"
                    enterFrom="transform opacity-0"
                    enterTo="transform opacity-100"
                    leave="ease-in duration-300"
                    leaveFrom="transform opacity-100"
                    leaveTo="transform opacity-0"
                    className="fixed inset-0 transition-opacity"
                >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </Transition>

                <Transition
                    show={show}
                    enter="ease-out duration-300"
                    enterFrom="transform translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="transform opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-300"
                    leaveFrom="transform opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="transform translate-y-4 sm:translate-y-0 sm:scale-95"
                    className="absolute top-0 left-0 flex items-center justify-center w-screen h-full"
                >
                    <div
                        className="absolute z-10 inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl pointer-events-auto sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="modal-headline"
                    >
                        <div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3
                                        className="text-lg font-bold leading-6 text-pzh-blue"
                                        id="modal-headline"
                                    >
                                        Verwijderen {item.Type.toLowerCase()}{" "}
                                        {item.Volgnummer}
                                    </h3>
                                    <span
                                        className="p-2 cursor-pointer"
                                        onClick={() => setDeleteIsOpen(false)}
                                    >
                                        <FontAwesomeIcon
                                            className="text-pzh-blue"
                                            icon={faTimes}
                                        />
                                    </span>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-800">
                                        Je staat op het punt om{" "}
                                        {item.Type.toLowerCase()}{" "}
                                        {item.Volgnummer} te verwijderen.
                                        {item.Children.length > 0 &&
                                        item.Type !== "Artikel" ? (
                                            <span>
                                                {" "}
                                                Op dit moment{" "}
                                                {item.Children.length === 1
                                                    ? `valt er ${item.Children.length} onderdeel `
                                                    : `vallen er ${item.Children.length} onderdelen `}{" "}
                                                onder. Je kunt pas{" "}
                                                {item.Type.toLowerCase()}{" "}
                                                {item.Volgnummer} verwijderen
                                                zodra de onderliggende
                                                onderdelen verwijderd zijn.
                                            </span>
                                        ) : null}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-6">
                            <span className="flex items-center justify-between w-full">
                                <button
                                    className="py-2 pr-4 text-xs text-gray-700 cursor-pointer hover:underline"
                                    onClick={() => setDeleteIsOpen(false)}
                                >
                                    Annuleren
                                </button>
                                <button
                                    onClick={() => {
                                        if (
                                            item.Children.length > 0 &&
                                            item.Type !== "Artikel"
                                        )
                                            return
                                        setDeleteIsOpen(false)
                                        deleteItem()
                                    }}
                                    type="button"
                                    className={`inline-flex justify-center px-4 py-2 text-base font-medium leading-6 text-white transition duration-150 ease-in-out ${
                                        item.Children.length > 0 &&
                                        item.Type !== "Artikel"
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-500"
                                    } border border-transparent rounded-md shadow-sm focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo `}
                                >
                                    Verwijder {item.Type.toLowerCase()}
                                </button>
                            </span>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    )
}

export default CrudDropdown
