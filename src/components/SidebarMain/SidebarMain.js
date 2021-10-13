import React from "react"

import MenuItemsList from "./../MenuItemsList"

import UserContext from "./../../App/UserContext"

import {
    menuItemsOmgevingsbeleid,
    menuItemsBeheer,
} from "./../../constants/menuItems"

/**
 * @returns The main sidebar component for the mutate environment
 */
function SidebarMain() {
    const { user } = React.useContext(UserContext)
    const gebruikersNaam = user ? user.Gebruikersnaam : null
    const gebruikersRol = user ? user.Rol : null
    const isAuthenticated =
        gebruikersRol === "Beheerder" ||
        gebruikersRol === "Functioneel beheerder" ||
        gebruikersRol === "Technisch beheerder" ||
        gebruikersRol === "Test runner" ||
        gebruikersRol === "Tester"

    return (
        <div className="inline-block w-1/4 rounded">
            <div>
                <span className="inline-block mt-1 mb-2 text-gray-800">
                    Omgevingsbeleid
                </span>
                <h2 className="block text-2xl">
                    {gebruikersNaam !== null
                        ? `Welkom ${gebruikersNaam},`
                        : "Welkom,"}
                </h2>
                <p className="text-gray-700">
                    In deze omgeving heb je de mogelijkheid om te werken aan
                    Omgevingsbeleid.
                </p>
            </div>
            <nav className="pt-2">
                <h2 className="pr-2 mt-8 mb-2 text-xl text-gray-800">
                    Omgevingsbeleid
                </h2>
                <MenuItemsList
                    displayChangePassword={true}
                    menuItems={menuItemsOmgevingsbeleid}
                />
                {isAuthenticated ? (
                    <React.Fragment>
                        <h2 className="pr-2 mt-8 mb-2 text-xl text-gray-800">
                            Beheer
                        </h2>
                        <MenuItemsList menuItems={menuItemsBeheer} />
                    </React.Fragment>
                ) : null}
            </nav>
        </div>
    )
}

export default SidebarMain
