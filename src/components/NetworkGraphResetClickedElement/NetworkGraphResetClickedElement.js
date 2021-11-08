import React from "react"
import { faUndo } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Transition } from "@headlessui/react"

/**
 * @param {object} clickedNode - The corresponding node that has been clicked
 * @param {function} resetNodes - Function to reset the styles of all nodes, and set clickedNode to null
 * @returns Component that indicates what element has been clicked, with a link to the detail page
 */
const NetworkGraphResetClickedElement = ({ clickedNode, resetNodes }) => {
    const [localOpenState, setLocalOpenState] = React.useState(false)

    React.useEffect(() => {
        if (!clickedNode) {
            setLocalOpenState(false)
        } else {
            setLocalOpenState(true)
        }
    }, [clickedNode])

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="container relative flex h-full mx-auto">
                <div className="absolute top-0 right-0 mr-2 mt-14">
                    <Transition
                        show={localOpenState}
                        enter="transition ease-out duration-150 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-0 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div
                            role="button"
                            tabIndex="0"
                            onClick={() => resetNodes()}
                            className="relative flex items-center justify-center px-2 py-2 mt-0 text-lg transition-shadow duration-100 ease-in bg-white rounded shadow-md cursor-pointer pointer-events-auto hover:shadow-lg"
                            data-testid="button-reset-nodes"
                        >
                            <FontAwesomeIcon icon={faUndo} />
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    )
}

export default NetworkGraphResetClickedElement
