import { Text } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
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
    const demonstrativePronoun =
        networkGraphConnectionProperties[type]?.demonstrativePronoun
    const href = networkGraphGenerateHref({
        property: type,
        UUID: clickedNode?.UUID,
    })

    return (
        <div className="absolute top-0 left-0 mt-4 ml-4">
            <AnimatePresence>
                {localOpenState && (
                    <motion.div
                        role="tooltip"
                        className="relative pt-3 pb-2 pl-4 pr-16 text-base text-white bg-black rounded-md pointer-events-auto bg-opacity-80 rouned"
                        initial={{ scale: 0.9, top: -5 }}
                        animate={{ scale: 1, top: 0 }}
                        exit={{ scale: 1 }}>
                        <Link role="link" to={href || '#'}>
                            <Text
                                color="white"
                                type="body-small"
                                className="underline">
                                Bekijk {demonstrativePronoun}{' '}
                                {singularTitle.toLowerCase()}
                            </Text>
                            <Text
                                color="white"
                                className="block mt-1 font-bold"
                                type="body-small">
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
                            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mt-2 ml-1 mr-2 transition-colors duration-100 ease-in rounded cursor-pointer hover:bg-black bg-opacity-80 hover:bg-opacity-50">
                            <Xmark />
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default NetworkGraphClickedElementPopup
