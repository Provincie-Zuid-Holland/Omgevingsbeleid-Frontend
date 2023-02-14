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
        <div className="container relative flex h-full mx-auto">
            <Transition
                show={localOpenState}
                enter="transition ease-out duration-150 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-0 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => resetNodes && resetNodes()}
                    className="p-3 mt-2 text-white border-b rounded-md bg-pzh-red hover:bg-pzh-red-dark"
                    data-testid="button-reset-nodes">
                    <RotateLeft />
                </div>
            </Transition>
        </div>
    )
}

export default NetworkGraphResetClickedElement
