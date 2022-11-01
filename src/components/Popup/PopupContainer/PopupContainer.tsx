import { Transition } from '@headlessui/react'
import { FC, useEffect, useRef } from 'react'
import { useLockBodyScroll } from 'react-use'

/**
 * Displays a popup container containing children components.
 *
 * @param {object} children - Can contain child component(s).
 * @param {boolean} show - Used to display the transitions of the popup.
 * @param {function} close - Function that is used to close the popup.
 */

interface PopupContainerProps {
    show?: boolean
    close: () => void
}

const PopupContainer: FC<PopupContainerProps> = ({ children, show, close }) => {
    const node = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const closeOnEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && close) {
                close()
            }
        }

        const handleClick = (e: MouseEvent) => {
            if (node.current && node.current.contains(e.target as Node)) {
                // inside click
                return
            } else if (close) {
                // outside click
                close()
            }
        }

        document.addEventListener('mousedown', handleClick)
        window.addEventListener('keydown', closeOnEscape)
        return () => {
            document.removeEventListener('mousedown', handleClick)
            window.removeEventListener('keydown', closeOnEscape)
        }
    }, [close])

    // Lock window scroll when the modal is open
    useLockBodyScroll(show)

    return (
        <div
            className={`fixed bottom-0 inset-x-0 px-4 pb-4 z-10 sm:inset-0 sm:items-center sm:justify-center sm:flex ${
                show ? '' : 'pointer-events-none'
            }`}>
            <Transition
                show={show}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className="fixed inset-0 transition-opacity">
                    <div className="absolute inset-0 w-full h-full bg-gray-800 opacity-50"></div>
                </div>
            </Transition>

            <Transition
                className="w-screen h-screen"
                show={show}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                <div className="z-20 w-full h-full" ref={node}>
                    {children}
                </div>
            </Transition>
        </div>
    )
}

export default PopupContainer
