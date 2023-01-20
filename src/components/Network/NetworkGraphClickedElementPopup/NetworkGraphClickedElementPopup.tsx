import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'
import { Text } from '@pzh-ui/components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import networkGraphConnectionProperties from '@/constants/networkGraphConnectionProperties'
import networkGraphGenerateHref from '@/utils/networkGraphGenerateHref'

/**
 *
 * @param {object} clickedNode - The corresponding node that has been clicked
 * @param {function} resetNodes - Function to reset the styles of all nodes, and set clickedNode to null
 * @returns Component that indicates what element has been clicked, with a link to the detail page
 */

interface Props {
    clickedNode: any
    resetNodes: () => void
}

const NetworkGraphClickedElementPopup = ({
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

    const title = clickedNode?.Titel
    const type =
        clickedNode?.Type as keyof typeof networkGraphConnectionProperties
    const singularTitle = networkGraphConnectionProperties[type]?.singular
    const href = networkGraphGenerateHref({
        property: type,
        UUID: clickedNode?.UUID,
    })

    return (
        <div className="absolute top-0 left-0 mt-4 ml-4">
            <Transition
                show={localOpenState}
                enter="transition ease-out duration-150 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-0 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <div
                    role="tooltip"
                    className="relative pt-2 pb-1 pl-4 pr-16 text-base bg-white shadow-md pointer-events-auto rouned">
                    <Link role="link" to={href || '#'}>
                        <Text type="body-small">{singularTitle}</Text>
                        <Text className="block underline" type="body">
                            {title}
                        </Text>
                    </Link>
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                            setLocalOpenState(false)
                            resetNodes()
                        }}
                        onKeyPress={e => {
                            if (e.key === 'Enter') {
                                setLocalOpenState(false)
                                resetNodes()
                            }
                        }}
                        className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mx-1 mt-2 mr-1 transition-colors duration-100 ease-in rounded cursor-pointer hover:bg-gray-200">
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
            </Transition>
        </div>
    )
}

export default NetworkGraphClickedElementPopup
