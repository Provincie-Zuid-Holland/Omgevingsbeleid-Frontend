import { Text } from '@pzh-ui/components'
import { Xmark } from '@pzh-ui/icons'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
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

    const type =
        clickedNode?.Type as keyof typeof networkGraphConnectionProperties

    const href = networkGraphGenerateHref({
        property: type,
        UUID: clickedNode?.UUID,
    })

    const elementText = useMemo(() => {
        const getTitles = () => {
            const title = clickedNode?.Titel
            const singularTitle =
                networkGraphConnectionProperties[type]?.singular
            const singularTitlePrefix =
                networkGraphConnectionProperties[type]?.prefix
            const subTitle =
                singularTitle && singularTitlePrefix
                    ? `Bekijk ${singularTitlePrefix} ${singularTitle}`
                    : `Bekijk dit object`

            return {
                subTitle,
                title,
            }
        }

        if (clickedNode) {
            return getTitles()
        }
    }, [clickedNode, type])

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="container relative flex h-full mx-auto">
                <div className="absolute bottom-0 right-0 mx-2 mb-2">
                    <AnimatePresence>
                        {localOpenState && (
                            <motion.div
                                initial={{ opacity: 0, right: -10 }}
                                animate={{ opacity: 1, right: 0 }}
                                exit={{ opacity: 0, right: -10 }}
                                className="relative">
                                <div
                                    role="tooltip"
                                    className="relative p-4 pr-8 text-base bg-black rounded-md shadow-md pointer-events-auto bg-opacity-80">
                                    <Link
                                        role="link"
                                        className="block p-0 group"
                                        to={href || '#'}>
                                        <Text
                                            type="body-small"
                                            color="text-white"
                                            className="block group-hover:underline">
                                            {elementText?.title}
                                        </Text>
                                        <Text
                                            type="body-small"
                                            color="text-white"
                                            className="block font-bold">
                                            {elementText?.subTitle}
                                        </Text>
                                    </Link>
                                    <button
                                        type="button"
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
                                        className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 mx-1 mt-2 mr-1 text-white transition-colors duration-100 ease-in rounded cursor-pointer hover:bg-black">
                                        <Xmark />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default NetworkGraphClickedElementPopup
