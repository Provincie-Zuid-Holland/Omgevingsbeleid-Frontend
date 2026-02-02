import { Transition } from '@headlessui/react'
import { cn } from '@pzh-ui/components'
import { ArrowUpRightFromSquareLight } from '@pzh-ui/icons'
import { useClickOutside } from '@react-hookz/web'
import classNames from 'clsx'
import { ReactNode, useRef } from 'react'
import { Link } from 'react-router-dom'

export type DropdownItem = {
    text: string
    className?: string
    callback?: () => void
    link?: string
    isExternal?: boolean
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
            {items.map(item => {
                const Element = item.link
                    ? DropdownLinkElement
                    : DropdownTextElement

                return (
                    <Element
                        setIsOpen={setIsOpen}
                        item={item}
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
                    'tooltip-right tooltip-triangle bg-pzh-white text-pzh-gray-700 absolute top-0 right-0 z-50 mt-12 min-w-[200px] rounded text-left shadow-[0_0_8px_1px_rgba(0,0,0,0.2)]',
                    className
                )}
                ref={innerContainer}>
                <div className="relative h-full">
                    <ul className="text-pzh-blue-500 flex w-max flex-col gap-2 py-4">
                        {children}
                    </ul>
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
    setIsOpen: (isOpen: boolean) => void
}

const DropdownLinkElement = ({ item, setIsOpen }: DropdownElementProps) => (
    <li key={item.text}>
        <Link
            className={cn(
                'flex w-full items-center px-6 hover:underline',
                item.className
            )}
            to={item.link || ''}
            onClick={() => {
                item.callback?.()
                setIsOpen(false)
            }}
            {...(item.isExternal && {
                target: '_blank',
                rel: 'noopener noreferrer',
            })}>
            {item.text}
            {item.isExternal && (
                <ArrowUpRightFromSquareLight
                    className="ml-1"
                    aria-label="opent een nieuwe browsertab"
                />
            )}
        </Link>
    </li>
)

const DropdownTextElement = ({ item, setIsOpen }: DropdownElementProps) => (
    <li key={item.text}>
        <button
            onClick={() => {
                item.callback?.()
                setIsOpen(false)
            }}
            className={cn(
                'flex w-full cursor-pointer items-center px-6 text-left hover:underline',
                item.className
            )}>
            {item.text}
            {item.isExternal && (
                <ArrowUpRightFromSquareLight className="ml-1" />
            )}
        </button>
    </li>
)

export { DropdownContainer }
export default Dropdown
