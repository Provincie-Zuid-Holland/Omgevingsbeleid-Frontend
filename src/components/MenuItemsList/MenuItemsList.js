import React from "react"
import { NavLink } from "react-router-dom"
import { faAngleRight } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

/**
 * @param {object} menuItems - Contains the menu items
 * @returns An unorganized list containing the mapped menuItems with their corresponding links
 */
const MenuItemsList = ({ menuItems }) => (
    <ul>
        {Object.keys(menuItems).map((value, index) => {
            const id = `sidebar-href-${value.toLowerCase().replace(" ", "-")}`
            return (
                <NavLink
                    exact={value === "Dashboard"}
                    id={id}
                    activeClassName="font-bold bg-gray-300 text-gray-800 hover:bg-gray-300"
                    className="relative flex items-center px-2 py-1 mt-1 text-sm leading-loose text-gray-600 rounded cursor-pointer hover:bg-gray-200 hover:text-gray-900"
                    key={index}
                    to={menuItems[value].url}
                    activeStyle={{
                        cursor: "default !important",
                    }}
                >
                    {value}
                    <FontAwesomeIcon
                        className="absolute right-0 h-8 mr-3 text-lg main-sidebar-arrow"
                        icon={faAngleRight}
                    />
                </NavLink>
            )
        })}
    </ul>
)

export default MenuItemsList
