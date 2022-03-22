import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import { BeleidskeuzesRead } from '@/api/fetchers.schemas'

/**
 * Displays a popup with a dropdown.
 */

interface PopUpDetailDropdownProps {
    dataObject: BeleidskeuzesRead
    openState?: boolean
    toggleDropdown: () => void
    toggleStatusPopup: () => void
}

const PopUpDetailDropdown = ({
    dataObject,
    openState,
    toggleDropdown,
    toggleStatusPopup,
}: PopUpDetailDropdownProps) => {
    const innerContainer = useRef<HTMLDivElement>(null)

    useEffect(() => {
        /**
         * Function that handles click events from the user.
         */
        const handleClick = (e: MouseEvent) => {
            if (
                !innerContainer.current?.contains(e.target as Node) &&
                openState
            ) {
                toggleDropdown()
            }
        }

        document.addEventListener('mousedown', handleClick, false)

        return () => {
            document.removeEventListener('mousedown', handleClick, false)
        }
    }, [openState, toggleDropdown])

    return (
        <div
            className="absolute top-0 right-0 w-48 mt-2 mt-12 mr-2 text-gray-700 bg-white rounded shadow main-tooltip-container main-tooltip-container-muteer-detail tooltip-right"
            ref={innerContainer}>
            <div className="relative h-full">
                <ul className="text-sm text-gray-800">
                    <li
                        className="px-4 py-2 text-sm cursor-pointer"
                        onClick={() => {
                            toggleDropdown()
                            toggleStatusPopup()
                        }}>
                        Status aanpassen
                    </li>
                    <li>
                        <Link
                            id="navbar-popup-href-raadpleeg-omgeving"
                            to={`/`}
                            className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300">
                            Raadpleegomgeving
                        </Link>
                    </li>
                    <li>
                        <Link
                            id="navbar-popup-href-raadpleeg-omgeving"
                            to={`/muteer/beleidsrelaties/${dataObject.UUID}`}
                            className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300">
                            Bekijk beleidsrelaties
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default PopUpDetailDropdown
