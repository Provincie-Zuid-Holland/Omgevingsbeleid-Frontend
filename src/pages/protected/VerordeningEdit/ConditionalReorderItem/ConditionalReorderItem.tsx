import classNames from 'classnames'
import {
    DragControls,
    Reorder,
    useDragControls,
    useMotionValue,
    motion,
} from 'framer-motion'

import { VerordeningChildRead } from '@/types/verordening'

import { useVerordening } from '../verordeningEditContext'

export type ConditionalReorderItemProps = {
    children: ({ controls }: { controls: DragControls }) => JSX.Element
    section: VerordeningChildRead
    onClick?: () => void
    className?: string
}

const ConditionalReorderItem = ({
    children,
    section,
    onClick,
    className = '',
}: ConditionalReorderItemProps) => {
    const controls = useDragControls()
    const { state } = useVerordening()
    const { isEditingOrder } = state
    const y = useMotionValue(0)

    // if (isEditingOrder) {
    if (true) {
        return (
            <Reorder.Item
                value={section}
                className={className}
                id={section.UUID}
                style={{ y }}
                dragListener={false}
                onClick={onClick}
                dragControls={controls}>
                {children({
                    controls,
                })}
            </Reorder.Item>
        )
    } else {
        return (
            <motion.li
                key={section.UUID}
                variants={{
                    visible: { opacity: 1, x: 0 },
                    hidden: { opacity: 0, x: -5 },
                }}
                className={classNames('list-none', {
                    [className || '']: className,
                })}
                onClick={onClick}>
                {children({ controls })}
            </motion.li>
        )
    }
}

export default ConditionalReorderItem
