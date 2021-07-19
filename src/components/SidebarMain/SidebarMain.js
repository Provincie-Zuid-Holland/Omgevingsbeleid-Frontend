import React from 'react'
import { NavLink } from 'react-router-dom'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import UserContext from './../../App/UserContext'

const menuItemsOmgevingsbeleid = {
    Dashboard: { url: '/muteer/dashboard' },
    'Mijn beleid': { url: '/muteer/mijn-beleid' },
    Beleidsrelaties: { url: '/muteer/beleidsrelaties' },
    Uitloggen: { url: '/logout' },
}

const menuItemsBeheer = {
    Beleidsmodules: { url: '/muteer/beleidsmodules' },
    Beleidskeuzes: { url: '/muteer/beleidskeuzes' },
    Beleidsregels: { url: '/muteer/beleidsregels' },
    Maatregelen: { url: '/muteer/maatregelen' },
    Ambities: { url: '/muteer/ambities' },
    Belangen: { url: '/muteer/belangen' },
    Themas: { url: '/muteer/themas' },
    Verordening: { url: '/muteer/verordeningen' },
    Beleidsdoelen: { url: '/muteer/beleidsdoelen' },
    Beleidsprestaties: { url: '/muteer/beleidsprestaties' },
}

function ReturnNavLink({ value, index, url }) {
    return (
        <NavLink
            exact={value === 'Dashboard'}
            id={`sidebar-href-${value.toLowerCase().replace(' ', '-')}`}
            activeClassName="font-bold bg-gray-300 text-gray-800 hover:bg-gray-300"
            className="relative flex items-center px-2 py-1 mt-1 text-sm leading-loose text-gray-600 rounded cursor-pointer hover:bg-gray-200 hover:text-gray-900"
            key={index}
            to={url}
            activeStyle={{
                cursor: 'default !important',
            }}
        >
            {value}
            <FontAwesomeIcon
                className="absolute right-0 h-8 mr-3 text-lg main-sidebar-arrow"
                icon={faAngleRight}
            />
        </NavLink>
    )
}

// TODO: Refactor finished props... And put in own component
/**
 * Function to render the returnMenuItems component using the ReturnNavLink component.
 *
 * @param {array} menuItems - Parameter used to render the ReturnNavLink component based on the value of the parameter.
 */
function returnMenuItems(menuItems) {
    const listItems = Object.keys(menuItems).map((value, index) => (
        <ReturnNavLink
            key={index}
            index={index}
            url={menuItems[value].url}
            value={value}
        />
    ))
    return listItems
}

/**
 * Function to render the MainSideBarHeading component.
 *
 * @param {props} props - Parameter that renders the value within the component.
 */
function MainSideBarHeading(props) {
    return (
        <h2 className="pr-2 mt-8 mb-2 text-xl text-gray-800">
            {props.children}
        </h2>
    )
}

/**
 * Component that renders the SideBarMain component.
 */
function SidebarMain() {
    const { user } = React.useContext(UserContext)
    const gebruikersNaam = user ? user.Gebruikersnaam : null
    const gebruikersRol = user ? user.Rol : null

    return (
        <div className="inline-block w-1/4 rounded">
            <div>
                <span className="inline-block mt-1 mb-2 text-gray-800">
                    Omgevingsbeleid
                </span>
                <h2 className="block text-2xl">
                    {gebruikersNaam !== null
                        ? `Welkom ${gebruikersNaam},`
                        : 'Welkom,'}
                </h2>
                <p className="text-gray-700">
                    In deze omgeving heb je de mogelijkheid om te werken aan
                    Omgevingsbeleid.
                </p>
            </div>
            <nav className="pt-2">
                <MainSideBarHeading>Omgevingsbeleid</MainSideBarHeading>
                <ul>{returnMenuItems(menuItemsOmgevingsbeleid)}</ul>
                {gebruikersRol === 'Beheerder' ||
                gebruikersRol === 'Functioneel beheerder' ||
                gebruikersRol === 'Technisch beheerder' ||
                gebruikersRol === 'Test runner' ||
                gebruikersRol === 'Tester' ? (
                    <React.Fragment>
                        <MainSideBarHeading>Beheer</MainSideBarHeading>
                        <ul>{returnMenuItems(menuItemsBeheer)}</ul>
                    </React.Fragment>
                ) : null}
            </nav>
        </div>
    )
}

export default SidebarMain
