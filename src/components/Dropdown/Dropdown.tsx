import classNames from 'classnames'
import { motion, AnimatePresence } from 'framer-motion'
import { FC, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useClickAway } from 'react-use'

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
            {items.map((item, index) =>
                item.link ? (
                    <DropdownLinkElement
                        setIsOpen={setIsOpen}
                        item={item}
                        index={index}
                        key={item.text}
                    />
                ) : (
                    <DropdownTextElement
                        key={item.text}
                        item={item}
                        index={index}
                        setIsOpen={setIsOpen}
                    />
                )
            )}
        </DropdownContainer>
    )
}

type DropdownContainerProps = {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    className?: string
}

const DropdownContainer: FC<DropdownContainerProps> = ({
    isOpen,
    setIsOpen,
    className,
    children,
}) => {
    const innerContainer = useRef<HTMLDivElement>(null)
    useClickAway(innerContainer, () => {
        setIsOpen(false)
    })

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    data-testid="dropdown"
                    className={classNames(
                        'absolute top-0 text-left right-0 z-50 min-w-[200px] mt-12 text-gray-700 bg-white rounded shadow-[0_0_15px_5px_rgba(0,0,0,0.1)] tooltip-right tooltip-triangle',
                        className
                    )}
                    ref={innerContainer}
                    initial={{ scale: 0.9, top: -5 }}
                    animate={{ scale: 1, top: 0 }}
                    exit={{ scale: 1 }}>
                    <div className="relative h-full">
                        <ul className="py-1 w-max text-gray-800">{children}</ul>
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
                    'block px-4 pb-[2px] pt-[6px] hover:bg-pzh-gray-100 hover:bg-opacity-25 hover:underline w-full',
                    {
                        'border-t border-gray-300': index !== 0,
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
                'hover:bg-pzh-gray-100 hover:bg-opacity-50 hover:underline w-full px-4 hover-pzh-gray-100 cursor-pointer pb-[2px] pt-[6px]',
                {
                    'border-t border-gray-300': index !== 0,
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
