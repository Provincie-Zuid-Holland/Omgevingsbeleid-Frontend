import { Transition } from '@headlessui/react'
import { RotateLeft } from '@pzh-ui/icons'
import { useEffect, useState } from 'react'

/**
 * @param {object} clickedNode - The corresponding node that has been clicked
 * @param {function} resetNodes - Function to reset the styles of all nodes, and set clickedNode to null
 * @returns Component that indicates what element has been clicked, with a link to the detail page
 */

interface Props {
    clickedNode: any
    resetNodes?: () => void
}

const NetworkGraphResetClickedElement = ({
    clickedNode,
    resetNodes,
}: Props) => {
    const [localOpenState, setLocalOpenState] = useState(false)

    useEffect(() => {
        if (!clickedNode) {
            setLocalOpenState(false)
        } else {
            setLocalOpenState(true)
        }
    }, [clickedNode])

    return (
        <Transition
            show={localOpenState}
            enter="transition ease-out duration-150 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-0 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <button
                type="button"
                tabIndex={0}
                onClick={() => resetNodes && resetNodes()}
                className="p-2 mt-2 bg-white border rounded-md pointer-events-auto text-pzh-blue-dark hover:bg-gray-50"
                data-testid="button-reset-nodes">
                <RotateLeft />
            </button>
        </Transition>
    )
}

export default NetworkGraphResetClickedElement
