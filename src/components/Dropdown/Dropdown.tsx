import { Transition } from '@headlessui/react'
import { useClickOutside } from '@react-hookz/web'
import classNames from 'clsx'
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
    hasBackdrop?: boolean
}

const DropdownContainer = ({
    isOpen,
    setIsOpen,
    className,
    children,
    hasBackdrop,
}: DropdownContainerProps) => {
    const innerContainer = useRef<HTMLDivElement>(null)
    useClickOutside(innerContainer, () => {
        setIsOpen(false)
    })

    return (
        <>
            <Transition
                data-testid="dropdown"
                show={isOpen}
                enter="transition-all ease-out duration-100 transform"
                enterFrom="scale-90 -top-1"
                enterTo="scale-100 top-0"
                leave="transition-all ease-in duration-100 transform"
                leaveFrom="scale-100 top-0"
                leaveTo="scale-90 -top-1"
                className={classNames(
                    'tooltip-right tooltip-triangle bg-pzh-white text-pzh-gray-700 absolute top-0 right-0 z-50 mt-12 min-w-[200px] rounded text-left shadow-[0_0_15px_5px_rgba(0,0,0,0.1)]',
                    className
                )}
                ref={innerContainer}>
                <div className="relative h-full">
                    <ul className="text-pzh-gray-800 w-max py-1">{children}</ul>
                </div>
            </Transition>
            {hasBackdrop && isOpen && (
                <div className="bg-pzh-gray-800/30 fixed top-0 left-0 z-[1] block h-screen w-screen" />
            )}
        </>
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
                    'hover:bg-pzh-gray-100/25 block w-full px-4 pt-1.5 pb-0.5 hover:underline',
                    {
                        'border-pzh-gray-300 border-t': index !== 0,
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
        <li key={item.text}>
            <button
                onClick={() => {
                    item.callback?.()
                    setIsOpen(false)
                }}
                className={classNames(
                    'hover:bg-pzh-gray-100/50 w-full cursor-pointer px-4 pt-1.5 pb-0.5 text-left hover:underline',
                    {
                        'border-pzh-gray-300 border-t': index !== 0,
                    },
                    item.className
                )}>
                {item.text}
            </button>
        </li>
    )
}

export { DropdownContainer }
export default Dropdown
