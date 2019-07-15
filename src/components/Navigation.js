import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function getToken() {
    return localStorage.getItem('access_token')
}

function logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('access_token')
}

function LoggedIn() {
    let identifier = localStorage.getItem('identifier')
    let gebruikersNaam = ''
    if (identifier !== null) {
        gebruikersNaam = JSON.parse(identifier).Gebruikersnaam.split(' ')[0]
    } else {
        gebruikersNaam = null
    }

    return (
        <Link to={`/login`} onClick={logout} className="text-sm text-gray-800">
            <span>
                {gebruikersNaam !== null
                    ? `Ingelogd als ${gebruikersNaam}`
                    : 'Ingelogd'}
            </span>
            <FontAwesomeIcon
                className="ml-2 text-gray-700"
                icon={faCaretDown}
            />
        </Link>
    )
}

function LoginLogoutButton() {
    if (getToken()) {
        return <LoggedIn />
    } else {
        return <p className="text-white">Not Logged In</p>
    }
}

class Navigation extends Component {
    render() {
        return (
            <nav className="bg-white border-b border-gray-200 fixed w-full z-10 top-0">
                <div className="bg-white py-6 container mx-auto flex items-center justify-between flex-wrap bg-white px-6">
                    <div className="flex items-center flex-no-shrink text-black mr-6 py-2">
                        <Link to={`/`} className="text-blue">
                            <div className="main-logo" />
                        </Link>
                    </div>
                    <div className="flex items-center justify-end">
                        <LoginLogoutButton />
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navigation
