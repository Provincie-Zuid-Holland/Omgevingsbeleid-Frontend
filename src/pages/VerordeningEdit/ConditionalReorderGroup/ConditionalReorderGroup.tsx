import {
    Reorder,
    useDragControls,
    useMotionValue,
    motion,
    DragControls,
} from 'framer-motion'
import { FC, Fragment } from 'react'

import { useVerordening } from './../verordeningEditContext'

export type ConditionalReorderGroupProps = {
    values: unknown[]
    indexPath: number[]
    replaceUlForFragment?: string | null
}

const ConditionalReorderGroup: FC<ConditionalReorderGroupProps> = ({
    children,
    values,
    indexPath,
    replaceUlForFragment,
}) => {
    const { state, dispatch } = useVerordening()
    const { isEditingOrder } = state

    const groupVariants = {
        visible: {
            transition: {
                staggerChildren: 0.05,
            },
        },
        hidden: {},
    }

    if (true) {
        // if (isEditingOrder) {
        return (
            <Reorder.Group
                axis="y"
                className="my-4 space-y-2"
                onReorder={reorderedSections => {
                    dispatch({
                        type: 'reorderSections',
                        payload: { reorderedSections, indexPath },
                    })
                }}
                values={values}>
                {children}
            </Reorder.Group>
        )
    } else if (replaceUlForFragment) {
        return <Fragment>{children}</Fragment>
    } else {
        return (
            <motion.ul
                variants={groupVariants}
                initial="hidden"
                animate="visible"
                className="my-4 space-y-2">
                {children}
            </motion.ul>
        )
    }
}

export default ConditionalReorderGroup
