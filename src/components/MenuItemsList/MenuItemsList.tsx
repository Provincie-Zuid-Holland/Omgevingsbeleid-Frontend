import {
    faAngleRight,
    faExternalLinkSquare,
} from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import PasswordChangeModal from '../PasswordChangeModal'

/**
 * @param {object} menuItems - Contains the menu items
 * @returns An unorganized list containing the mapped menuItems with their corresponding links
 */

interface MenuItemsListProps {
    menuItems: {
        [key: string]: {
            url: string
        }
    }
    displayChangePassword?: boolean
}

const MenuItemsList = ({
    menuItems,
    displayChangePassword,
}: MenuItemsListProps) => {
    const [passwordChangeOpen, setPasswordChangeOpen] = useState(false)

    return (
        <>
            <ul>
                {Object.keys(menuItems).map(value => {
                    const id = `sidebar-href-${value
                        .toLowerCase()
                        .replace(' ', '-')}`

                    return (
                        <li key={id}>
                            <NavLink
                                id={id}
                                className={({ isActive }) =>
                                    classNames(
                                        'relative flex items-center px-2 py-1 mt-1 text-sm leading-loose text-gray-600 rounded cursor-pointer hover:bg-gray-200 hover:text-gray-900',
                                        {
                                            'font-bold bg-gray-300 text-gray-800 hover:bg-gray-300':
                                                isActive,
                                        }
                                    )
                                }
                                to={menuItems[value].url}
                                style={({ isActive }) =>
                                    isActive
                                        ? {
                                              cursor: 'default !important',
                                          }
                                        : {}
                                }>
                                {value}
                                <FontAwesomeIcon
                                    className="absolute right-0 h-8 mr-3 text-lg main-sidebar-arrow"
                                    icon={faAngleRight}
                                />
                            </NavLink>
                        </li>
                    )
                })}
                {displayChangePassword ? (
                    <li
                        id={`sidebar-change-password`}
                        className="relative flex items-center px-2 py-1 mt-1 text-sm leading-loose text-gray-600 rounded cursor-pointer hover:bg-gray-200 hover:text-gray-900"
                        onClick={() => setPasswordChangeOpen(true)}
                        onKeyDown={e => {
                            if (e.code === 'Enter' || e.code === 'Space')
                                setPasswordChangeOpen(true)
                        }}
                        tabIndex={0}>
                        Wachtwoord wijzigen
                        <FontAwesomeIcon
                            className="absolute right-0 h-8 mr-3 text-xs"
                            icon={faExternalLinkSquare}
                        />
                    </li>
                ) : null}
            </ul>
            {passwordChangeOpen ? (
                <PasswordChangeModal setOpen={setPasswordChangeOpen} />
            ) : null}
        </>
    )
}

export default MenuItemsList
