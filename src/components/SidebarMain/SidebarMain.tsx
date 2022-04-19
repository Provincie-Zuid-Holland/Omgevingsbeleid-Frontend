import {
    menuItemsOmgevingsbeleid,
    menuItemsBeheer,
} from '@/constants/menuItems'
import useAuth from '@/hooks/useAuth'

import MenuItemsList from '../MenuItemsList'

/**
 * @returns The main sidebar component for the mutate environment
 */
function SidebarMain() {
    const { user } = useAuth()

    const username = user ? user.Gebruikersnaam : null
    const userRole = user ? user.Rol : null

    const isAuthedForManaging =
        userRole === 'Beheerder' ||
        userRole === 'Functioneel beheerder' ||
        userRole === 'Technisch beheerder' ||
        userRole === 'Test runner' ||
        userRole === 'Tester'

    return (
        <div className="inline-block w-1/4 rounded">
            <div>
                <span className="inline-block mt-1 mb-2 text-gray-800">
                    Omgevingsbeleid
                </span>
                <h1 className="block text-2xl">
                    {username !== null ? `Welkom ${username},` : 'Welkom,'}
                </h1>
                <p className="text-gray-700">
                    In deze omgeving heb je de mogelijkheid om te werken aan
                    Omgevingsbeleid.
                </p>
            </div>
            <nav className="pt-2" id="side-navigation">
                <h2 className="pr-2 mt-8 mb-2 text-xl text-gray-800">
                    Omgevingsbeleid
                </h2>
                <MenuItemsList
                    displayChangePassword
                    menuItems={menuItemsOmgevingsbeleid}
                />
                {isAuthedForManaging ? (
                    <>
                        <h2 className="pr-2 mt-8 mb-2 text-xl text-gray-800">
                            Beheer
                        </h2>
                        <MenuItemsList menuItems={menuItemsBeheer} />
                    </>
                ) : null}
            </nav>
        </div>
    )
}

export default SidebarMain
