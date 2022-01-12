import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

import { useWindowSize } from '../../utils/useWindowSize'

const Modal = ({
    children,
    open,
    close,
    maxWidth = 'max-w-6xl',
    containerPadding = 'sm:p-8 p-6',
}) => {
    const { width: screenWidth } = useWindowSize()

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 overflow-hidden"
                onClose={close}
            >
                <div
                    className={`flex items-end justify-center min-h-screen overflow-hidden text-center rounded-lg sm:block px-4 pt-4 pb-4 sm:p-2`}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 transition-opacity bg-opacity-50 bg-pzh-blue" />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span
                        className="hidden sm:inline-block sm:align-middle sm:h-screen"
                        aria-hidden="true"
                    >
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
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
                                className={`overflow-y-auto pointer-events-none ${containerPadding}`}
                                style={{
                                    maxHeight:
                                        screenWidth < 640
                                            ? 'calc(100vh - 2rem)' // 2rem equals the top and bottom padding
                                            : '75vh',
                                }}
                            >
                                <div className="absolute top-0 right-0 z-10 block pt-8 pr-8 -mt-8 -mr-8 sm:-mt-2 sm:-mr-2">
                                    <button
                                        type="button"
                                        className="p-2 pb-0 text-gray-400 bg-white rounded-md pointer-events-auto hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        onClick={close}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            className="w-4 h-4"
                                        />
                                        <span className="sr-only">Close</span>
                                    </button>
                                </div>
                                <div className="pointer-events-auto">
                                    {children}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default Modal
