import { useUpdateEffect } from '@react-hookz/web'
import classNames from 'classnames'
import {
    Children,
    HTMLAttributes,
    ReactNode,
    cloneElement,
    isValidElement,
    useState,
} from 'react'

import { AngleDown } from '@pzh-ui/icons'

interface AccordionProps {
    className?: string
    children: ReactNode | ReactNode[]
    activeItem?: string
    onClickCallback?: (item: string) => void
}

const Accordion = ({
    className,
    children,
    activeItem,
    onClickCallback,
}: AccordionProps) => {
    const [openItemId, setOpenItemId] = useState<string | null>(
        activeItem || null
    )

    const handleItemClick = (itemId: string) => {
        setOpenItemId(prevItemId => (prevItemId === itemId ? null : itemId))
        onClickCallback?.(itemId)
    }

    useUpdateEffect(() => {
        if (activeItem && activeItem !== openItemId) {
            handleItemClick(activeItem)
        }
    }, [activeItem])

    const processedChildren = Children.map(children, child => {
        if (isValidElement(child) && child.type === AccordionItem) {
            const itemId = child.props.uuid
            const itemProps = {
                ...(child.props as AccordionItemProps),
                isOpen: itemId === openItemId,
                onToggle: () =>
                    !child.props.isDisabled && handleItemClick(itemId),
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return <ul className={className}>{processedChildren}</ul>
}

interface AccordionItemProps extends AccordionProps {
    uuid?: string
    isOpen?: boolean
    isDisabled?: boolean
    onToggle?: () => void
}

const AccordionItem = ({
    className,
    children,
    isOpen,
    isDisabled,
    onToggle,
    ...rest
}: AccordionItemProps & HTMLAttributes<HTMLLIElement>) => {
    const processedChildren = Children.map(children, child => {
        if (isValidElement(child)) {
            const itemProps = {
                ...(child.props as AccordionProps),
                isOpen,
                isDisabled,
                onToggle,
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return (
        <li
            className={classNames('border-b border-pzh-gray-200', className)}
            data-expanded={isOpen}
            {...rest}>
            {processedChildren}
        </li>
    )
}

const AccordionTrigger = ({
    className,
    classNameButton,
    children,
    isOpen,
    isDisabled,
    onToggle,
    ...rest
}: AccordionItemProps &
    HTMLAttributes<HTMLDivElement> & { classNameButton?: string }) => {
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
        <div
            className={classNames(
                'relative flex w-full items-center',
                className
            )}
            {...rest}>
            {processedChildren}
            {!isDisabled && (
                <button
                    onClick={onToggle}
                    className={classNames(
                        "after:content-[' '] ml-auto after:absolute after:right-0 after:top-0 after:h-full",
                        classNameButton
                    )}>
                    <AngleDown
                        size={16}
                        className={classNames('text-pzh-blue transition', {
                            'rotate-180': isOpen,
                        })}
                    />
                </button>
            )}
        </div>
    )
}

const AccordionContent = ({
    className,
    children,
    isOpen,
}: AccordionItemProps) => {
    if (!isOpen) return null

    return <div className={classNames('py-2', className)}>{children}</div>
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
