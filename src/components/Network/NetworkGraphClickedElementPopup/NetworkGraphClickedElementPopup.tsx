import { Transition } from '@headlessui/react'
import { Xmark } from '@pzh-ui/icons'
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
    const singularTitlePrefix = networkGraphConnectionProperties[type]?.prefix
    const href = networkGraphGenerateHref({
        property: type,
        UUID: clickedNode?.UUID,
    })

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="container relative flex h-full mx-auto">
                <div className="absolute bottom-0 right-0 mx-2 mb-2">
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
                            className="relative py-2 pr-5 text-base bg-white shadow-md pointer-events-auto rouned">
                            <Link
                                role="link"
                                className="block p-3 pt-0 group"
                                to={href || '#'}>
                                <span className="block text-sm text-gray-600">
                                    {singularTitle}
                                </span>
                                <span className="block text-pzh-blue-dark">
                                    {title}
                                </span>
                                <span className="text-sm underline text-pzh-blue">
                                    {singularTitle && singularTitlePrefix
                                        ? `Bekijk ${singularTitlePrefix} ${singularTitle}`
                                        : `Bekijk dit object`}
                                </span>
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
                                <Xmark />
                            </span>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    )
}

export default NetworkGraphClickedElementPopup
