import React from "react"
import { Dialog, Transition } from "@headlessui/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/pro-solid-svg-icons"

const Modal = ({ children, open, close, maxWidth = "max-w-6xl" }) => (
    <Transition.Root show={open} as={React.Fragment}>
        <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={close}
        >
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 overflow-hidden text-center rounded-lg sm:block sm:p-0">
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                >
                    &#8203;
                </span>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <div
                        className={`inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full ${maxWidth}`}
                    >
                        <div
                            className="p-8 overflow-y-auto"
                            style={{
                                maxHeight: "calc(100vh - 25vh)",
                            }}
                        >
                            <div className="absolute top-0 right-0 hidden pt-8 pr-8 -mt-2 -mr-2 sm:block">
                                <button
                                    type="button"
                                    className="p-2 pb-0 text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={close}
                                >
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        className="w-4 h-4"
                                    />
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <div>{children}</div>
                        </div>
                    </div>
                </Transition.Child>
            </div>
        </Dialog>
    </Transition.Root>
)

export default Modal
