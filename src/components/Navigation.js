import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import {
    faCaretDown,
    faSignInAlt,
    faClock,
    faAngleRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function getToken() {
    return localStorage.getItem('access_token')
}

function logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('access_token')
}

class NavigationMenuPopUp extends Component {
    constructor(props) {
        super(props)

        this.state = {
            open: false,
        }

        this.innerContainer = React.createRef()

        this.toggleOpen = this.toggleOpen.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    toggleOpen() {
        console.log('Triggered!')
        this.setState({
            open: !this.state.open,
        })
    }

    handleClick = e => {
        if (
            !this.innerContainer.current.contains(e.target) &&
            this.state.open === true
        ) {
            this.setState({
                open: false,
            })
            return
        }
    }

    componentWillMount() {
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    getUserName() {
        let identifier = localStorage.getItem('identifier')
        let gebruikersNaam = ''
        if (identifier !== null) {
            gebruikersNaam = JSON.parse(identifier).Gebruikersnaam.split(' ')[0]
        } else {
            gebruikersNaam = null
        }
        return gebruikersNaam
    }

    render() {
        return (
            <span
                className="text-gray-600 text-sm mr-3 relative"
                ref={this.innerContainer}
            >
                <span
                    onClick={this.toggleOpen}
                    className="cursor-pointer select-none text-sm text-gray-800"
                >
                    <span>
                        {this.getUserName() !== null
                            ? `Ingelogd als ${this.getUserName()}`
                            : 'Ingelogd'}
                    </span>
                    <FontAwesomeIcon
                        className="ml-2 text-gray-700"
                        icon={faCaretDown}
                    />
                </span>
                {this.state.open ? (
                    <div
                        id="navigation-tooltip-container"
                        className="absolute bg-white rounded mt-2 w-48 -ml-12 text-gray-700"
                    >
                        <div className="h-full relative">
                            {/* <div className="absolute w-1 h-full border-l border-gray-300 z-0 top-0 ml-6" /> */}
                            <ul className="text-sm text-gray-800">
                                <li className="py-2 px-4 text-sm cursor-not-allowed">
                                    Mijn Instellingen
                                </li>
                                <li>
                                    <Link
                                        className="py-2 px-4 text-sm border-t border-gray-300 w-full inline-block"
                                        to={`/login`}
                                        onClick={logout}
                                        onClick={logout}
                                    >
                                        Uitloggen
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        {/* <div className="border-t border-gray-300 py-2 text-sm text-gray-700 px-4 cursor-pointer hover:underline">
                            Vergelijken
                            <FontAwesomeIcon
                                className="right-0 absolute text-gray-700 mr-4 mt-1"
                                icon={faAngleRight}
                            />
                        </div> */}
                    </div>
                ) : null}
            </span>
        )
    }
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
        return <NavigationMenuPopUp />
    } else {
        return (
            <Link className="text-sm" to="login">
                <FontAwesomeIcon
                    className="mr-2 text-gray-700"
                    icon={faSignInAlt}
                />
                <span className="text-gray-800">Inloggen</span>
            </Link>
        )
    }
}

class Navigation extends Component {
    render() {
        return (
            <nav className="bg-white border-b border-gray-200 fixed w-full z-10 top-0">
                <div className="bg-white py-6 container mx-auto flex items-center justify-between flex-wrap bg-white px-6">
                    <div className="flex items-center flex-no-shrink text-black mr-6 py-2">
                        {getToken() ? (
                            <Link to={`/dashboard`} className="text-blue">
                                <div className="main-logo" />
                            </Link>
                        ) : (
                            <Link to={`/`} className="text-blue">
                                <div className="main-logo" />
                            </Link>
                        )}
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
