import { AngleDown, GripDotsVertical } from '@pzh-ui/icons'
import classNames from 'classnames'
import {
    Children,
    ReactNode,
    cloneElement,
    isValidElement,
    useState,
} from 'react'

interface AccordionProps {
    className?: string
    children: ReactNode | ReactNode[]
    isDraggable?: boolean
}

const Accordion = ({ className, children, isDraggable }: AccordionProps) => {
    const [openItemIndex, setOpenItemIndex] = useState<number | null>(null)

    const handleItemClick = (index: number) => {
        setOpenItemIndex(prevIndex => (prevIndex === index ? null : index))
    }

    const processedChildren = Children.map(children, (child, index) => {
        if (isValidElement(child)) {
            const itemProps = {
                ...(child.props as AccordionProps),
                isDraggable,
                isOpen: index === openItemIndex,
                onToggle: () => handleItemClick(index),
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return <ul className={className}>{processedChildren}</ul>
}

interface AccordionItemProps extends AccordionProps {
    isOpen?: boolean
    onToggle?: () => void
}

const AccordionItem = ({
    isDraggable,
    className,
    children,
    isOpen,
    onToggle,
}: AccordionItemProps) => {
    const processedChildren = Children.map(children, child => {
        if (isValidElement(child)) {
            const itemProps = {
                ...(child.props as AccordionProps),
                isDraggable,
                isOpen,
                onToggle,
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return (
        <li
            className={classNames(
                'relative border-b border-pzh-gray-200 py-2',
                className
            )}>
            {processedChildren}
        </li>
    )
}

const AccordionTrigger = ({
    className,
    children,
    isDraggable,
    isOpen,
    onToggle,
}: AccordionItemProps) => {
    const processedChildren = Children.map(children, child => {
        if (isValidElement(child)) {
            const itemProps = {
                ...(child.props as AccordionProps),
                isOpen,
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return (
        <div className={classNames('flex w-full items-center', className)}>
            {isDraggable && (
                <GripDotsVertical
                    size={16}
                    className="mr-[16px] text-pzh-blue"
                />
            )}
            {processedChildren}
            <button
                onClick={onToggle}
                className="after:content-[' '] ml-auto after:absolute after:left-0 after:top-0 after:h-full after:w-full">
                <AngleDown
                    size={16}
                    className={classNames('text-pzh-blue transition', {
                        'rotate-180': isOpen,
                    })}
                />
            </button>
        </div>
    )
}

const AccordionContent = ({
    className,
    children,
    isOpen,
}: AccordionItemProps) => {
    if (!isOpen) return null

    return <div className={classNames('pt-2', className)}>{children}</div>
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
