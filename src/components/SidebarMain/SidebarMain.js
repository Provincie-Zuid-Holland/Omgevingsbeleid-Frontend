import React from 'react'
import { NavLink } from 'react-router-dom'

import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const menuItemsOmgevingsbeleid = {
    Dashboard: { url: '/dashboard', finished: true },
    'Mijn beleid': { url: '', finished: false },
    Meldingen: { url: '', finished: false },
    // 'API Test Omgeving': { url: '/api-test', finished: true },
}

const menuItemsGebruiker = {
    'Mijn account': { url: '', finished: false },
}

const menuItemsBeheer = {
    Beleidsbeslissingen: { url: '/beleidsbeslissingen', finished: true },
    Beleidsregels: { url: '/beleidsregels', finished: true },
    Maatregelen: { url: '/maatregelen', finished: true },
    Opgaven: { url: '/opgaven', finished: true },
    Ambities: { url: '/ambities', finished: true },
    Belangen: { url: '/belangen', finished: true },
    Themas: { url: '/themas', finished: true },
    Verordening: { url: '/verordening', finished: true },
}

function ReturnNavLink(props) {
    // If Dashboard exact, else not
    if (props.value === 'Dashboard') {
        return (
            <NavLink
                exact
                activeClassName="mt-1 relative text-sm block leading-loose py-1 px-2 font-bold rounded bg-gray-300 text-gray-800"
                className="mt-1 relative text-sm block leading-loose py-1 px-2 text-gray-600 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-900"
                key={props.index}
                to={props.url}
            >
                {props.value}
                <FontAwesomeIcon
                    className="absolute text-xl right-0 h-8 mr-3 main-sidebar-arrow"
                    icon={faAngleRight}
                />
            </NavLink>
        )
    } else {
        return (
            <NavLink
                activeClassName="mt-1 relative text-sm block leading-loose py-1 px-2 font-bold rounded bg-gray-300 text-gray-800"
                className="mt-1 relative text-sm block leading-loose py-1 px-2 text-gray-600 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-900"
                key={props.index}
                to={props.url}
            >
                {props.value}
                <FontAwesomeIcon
                    className="absolute text-xl right-0 h-8 mr-3 main-sidebar-arrow"
                    icon={faAngleRight}
                />
            </NavLink>
        )
    }
}

function returnMenuItems(menuItems) {
    const listItems = Object.keys(menuItems).map((value, index) =>
        menuItems[value].finished ? (
            <ReturnNavLink
                key={index}
                index={index}
                url={menuItems[value].url}
                value={value}
            />
        ) : (
            <li
                className="text-gray-600 mt-1 relative text-sm block leading-loose py-1 px-2  rounded cursor-not-allowed hover:bg-gray-300 hover:text-blue-900"
                key={index}
            >
                {value}
                <FontAwesomeIcon
                    className="absolute text-xl text-grey-300 right-0 h-8 mr-3 main-sidebar-arrow"
                    icon={faAngleRight}
                />
            </li>
        )
    )
    return listItems
}

function MainSideBarHeading(props) {
    return <h2 className="mt-8 mb-2 px-2 heading-serif-xl">{props.children}</h2>
}

function SidebarMain(props) {
    let identifier = localStorage.getItem('identifier')
    let gebruikersNaam = ''
    if (identifier !== null) {
        gebruikersNaam = JSON.parse(identifier).Gebruikersnaam.split(' ')[0]
    } else {
        gebruikersNaam = null
    }

    return (
        <div className="w-1/4 rounded inline-block">
            <div>
                <span className="heading-serif mb-2 inline-block">
                    Omgevingsbeleid
                </span>
                <h2 className="heading-serif-2xl block">
                    {gebruikersNaam !== null
                        ? `Welkom ${gebruikersNaam},`
                        : 'Welkom,'}
                </h2>
                <p className="paragraph">
                    In deze omgeving heb je de mogelijkheid om te werken aan
                    Omgevingsbeleid.
                </p>
            </div>
            <nav className="pt-2">
                <MainSideBarHeading>Omgevingsbeleid</MainSideBarHeading>
                <ul>{returnMenuItems(menuItemsOmgevingsbeleid)}</ul>
                <MainSideBarHeading>Gebruiker</MainSideBarHeading>
                <ul>{returnMenuItems(menuItemsGebruiker)}</ul>
                <MainSideBarHeading>Instellingen</MainSideBarHeading>
                <ul>{returnMenuItems(menuItemsBeheer)}</ul>
            </nav>
        </div>
    )
}

export default SidebarMain
