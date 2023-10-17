import { useClickOutside } from '@react-hookz/web'
import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useRef } from 'react'
import { Link } from 'react-router-dom'

export type DropdownItem = {
    text: string
    className?: string
    callback?: () => void
    link?: string
}

export interface DropdownProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    items: DropdownItem[]
    className?: string
}

function Dropdown({ isOpen, setIsOpen, items, className }: DropdownProps) {
    return (
        <DropdownContainer
            className={className}
            isOpen={isOpen}
            setIsOpen={setIsOpen}>
            {items.map((item, index) => {
                const Element = item.link
                    ? DropdownLinkElement
                    : DropdownTextElement

                return (
                    <Element
                        setIsOpen={setIsOpen}
                        item={item}
                        index={index}
                        key={item.text}
                    />
                )
            })}
        </DropdownContainer>
    )
}

type DropdownContainerProps = {
    children: ReactNode
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    className?: string
}

const DropdownContainer = ({
    isOpen,
    setIsOpen,
    className,
    children,
}: DropdownContainerProps) => {
    const innerContainer = useRef<HTMLDivElement>(null)
    useClickOutside(innerContainer, () => {
        setIsOpen(false)
    })

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    data-testid="dropdown"
                    className={classNames(
                        'tooltip-right tooltip-triangle absolute right-0 top-0 z-50 mt-12 min-w-[200px] rounded bg-white text-left text-pzh-gray-700 shadow-[0_0_15px_5px_rgba(0,0,0,0.1)]',
                        className
                    )}
                    ref={innerContainer}
                    initial={{ scale: 0.9, top: -5 }}
                    animate={{ scale: 1, top: 0 }}
                    exit={{ scale: 1 }}>
                    <div className="relative h-full">
                        <ul className="w-max py-1 text-pzh-gray-800">
                            {children}
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

type DropdownElementProps = {
    item: DropdownItem
    index: number
    setIsOpen: (isOpen: boolean) => void
}

const DropdownLinkElement = ({
    item,
    index,
    setIsOpen,
}: DropdownElementProps) => {
    return (
        <li key={item.text}>
            <Link
                className={classNames(
                    'block w-full px-4 pb-0.5 pt-1.5 hover:bg-pzh-gray-100 hover:bg-opacity-25 hover:underline',
                    {
                        'border-t border-pzh-gray-300': index !== 0,
                    }
                )}
                to={item.link || ''}
                onClick={() => {
                    item.callback?.()
                    setIsOpen(false)
                }}>
                {item.text}
            </Link>
        </li>
    )
}

const DropdownTextElement = ({
    item,
    index,
    setIsOpen,
}: DropdownElementProps) => {
    return (
        <li
            key={item.text}
            className={classNames(
                'hover-pzh-gray-100 w-full cursor-pointer px-4 pb-0.5 pt-1.5 hover:bg-pzh-gray-100 hover:bg-opacity-50 hover:underline',
                {
                    'border-t border-pzh-gray-300': index !== 0,
                },
                item.className
            )}>
            <button
                onClick={() => {
                    item.callback?.()
                    setIsOpen(false)
                }}>
                {item.text}
            </button>
        </li>
    )
}

export { DropdownContainer }
export default Dropdown
