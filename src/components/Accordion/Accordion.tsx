import { AngleDown } from '@pzh-ui/icons'
import { useUpdateEffect } from '@react-hookz/web'
import classNames from 'clsx'
import {
    Children,
    HTMLAttributes,
    ReactNode,
    cloneElement,
    isValidElement,
    useEffect,
    useState,
} from 'react'

interface AccordionProps {
    className?: string
    children: ReactNode | ReactNode[]
    activeItem?: string | null
    multipleOpen?: boolean
    onClickCallback?: (item: string | null) => void
}

const Accordion = ({
    className,
    children,
    activeItem,
    multipleOpen = false,
    onClickCallback,
}: AccordionProps) => {
    const [openItemIds, setOpenItemIds] = useState<string[]>(
        activeItem ? [activeItem] : []
    )

    const handleItemClick = (itemId: string) => {
        setOpenItemIds(prevItemIds => {
            if (prevItemIds.includes(itemId)) {
                // Item is already open, close it
                return multipleOpen
                    ? prevItemIds.filter(id => id !== itemId)
                    : []
            } else {
                // Item is not open, open it
                return multipleOpen ? [...prevItemIds, itemId] : [itemId]
            }
        })
        onClickCallback?.(itemId)
    }

    useUpdateEffect(() => {
        if (activeItem && activeItem !== openItemIds[0]) {
            handleItemClick(activeItem)
        }
    }, [activeItem])

    const processedChildren = Children.map(children, child => {
        if (isValidElement(child) && child.type === AccordionItem) {
            const itemId = child.props.uuid
            const itemProps = {
                ...(child.props as AccordionItemProps),
                isOpen: openItemIds.includes(itemId),
                onToggle: () =>
                    !child.props.isDisabled && handleItemClick(itemId),
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return <ul className={className}>{processedChildren}</ul>
}

interface AccordionItemProps extends HTMLAttributes<HTMLLIElement> {
    uuid?: string
    isOpen?: boolean
    isDisabled?: boolean
    onToggle?: () => void
    defaultOpen?: boolean
}

const AccordionItem = ({
    className,
    children,
    isOpen,
    defaultOpen = false,
    ...rest
}: AccordionItemProps) => {
    const [itemOpen, setItemOpen] = useState(defaultOpen)

    useUpdateEffect(() => {
        if (isOpen !== undefined && isOpen !== itemOpen) {
            setItemOpen(isOpen)
        }
    }, [isOpen])

    const toggleItem = () => {
        setItemOpen(prevItemOpen => !prevItemOpen)
        if (isOpen !== undefined && isOpen !== itemOpen) {
            setItemOpen(isOpen)
        }
    }

    useEffect(() => {
        if (defaultOpen !== itemOpen) {
            setItemOpen(defaultOpen)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultOpen])

    const processedChildren = Children.map(children, child => {
        if (isValidElement(child)) {
            const itemProps = {
                ...(child.props as AccordionProps),
                isOpen: itemOpen,
                onToggle: toggleItem,
            }
            return cloneElement(child, itemProps)
        }
        return child
    })

    return (
        <li
            className={classNames('border-b border-pzh-gray-200', className)}
            data-expanded={itemOpen}
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
                    )}
                    type="button"
                    aria-label={isOpen ? 'Inklappen' : 'Uitklappen'}>
                    <AngleDown
                        size={16}
                        className={classNames('text-pzh-blue-500 transition', {
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

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
