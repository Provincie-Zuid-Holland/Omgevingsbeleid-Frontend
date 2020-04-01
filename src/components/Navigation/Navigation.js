import React, { Component } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { faCaretDown, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { startOfMinute } from 'date-fns'

// function getToken() {
//     return localStorage.getItem('access_token')
// }

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

    componentDidMount() {
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
                className="relative mr-3 text-sm text-gray-600"
                ref={this.innerContainer}
            >
                <span
                    id="navbar-toggle-popup"
                    onClick={this.toggleOpen}
                    className="text-sm text-gray-800 cursor-pointer select-none"
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
                        className="absolute w-48 mt-2 -ml-12 text-gray-700 bg-white rounded"
                    >
                        <div className="relative h-full">
                            <ul className="text-sm text-gray-800">
                                <li className="px-4 py-2 text-sm cursor-not-allowed">
                                    Mijn Instellingen
                                </li>
                                <li>
                                    {this.props.currentScreenMuteerOmgeving ? (
                                        <Link
                                            id="navbar-popup-href-raadpleeg-omgeving"
                                            to={`/`}
                                            className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                                            onClick={this.toggleOpen}
                                        >
                                            Raadpleegomgeving
                                        </Link>
                                    ) : (
                                        <Link
                                            id="navbar-popup-href-raadpleeg-omgeving"
                                            to={`/muteer/dashboard`}
                                            className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                                            onClick={this.toggleOpen}
                                        >
                                            Muteeromgeving
                                        </Link>
                                    )}
                                </li>
                                <li>
                                    <Link
                                        id="navbar-popup-href-uitloggen"
                                        className="inline-block w-full px-4 py-2 text-sm border-t border-gray-300"
                                        to={`/login`}
                                        onClick={() => {
                                            logout()
                                            this.props.setLoginState(false)
                                        }}
                                    >
                                        Uitloggen
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : null}
            </span>
        )
    }
}

function LoginLogoutButton(props) {
    if (props.loggedIn) {
        return (
            <NavigationMenuPopUp
                currentScreenMuteerOmgeving={props.currentScreenMuteerOmgeving}
                setLoginState={props.setLoginState}
            />
        )
    } else {
        return (
            <Link className="text-sm" to="/login" id="href-naar-inloggen">
                <FontAwesomeIcon
                    className="mr-2 text-gray-700"
                    icon={faSignInAlt}
                />
                <span className="text-gray-800">Inloggen</span>
            </Link>
        )
    }
}

function Logo() {
    return (
        <React.Fragment>
            <div className="logo-beeldmerk" />
            <div className="logo-tekst" />
        </React.Fragment>
    )
}

function Navigation({ loggedIn, setLoginState }) {
    let location = useLocation()

    return (
        <nav className="fixed top-0 z-20 w-full bg-white" id="navigation-main">
            <div className="container flex flex-wrap items-center justify-between py-6 mx-auto bg-white border-b border-gray-200 lg:px-10">
                <div className="flex items-center py-2 mr-6 text-black flex-no-shrink">
                    {loggedIn ? (
                        <Link
                            id="href-naar-home"
                            to={`/muteer/dashboard`}
                            className="text-blue"
                        >
                            <Logo />
                            <span className="absolute px-1 pl-8 mt-2 ml-32 font-serif text-xs tracking-widest text-gray-600 uppercase">
                                Beta
                            </span>
                        </Link>
                    ) : (
                        <Link
                            id="href-naar-home"
                            to={`/`}
                            className="text-blue"
                        >
                            <Logo />
                        </Link>
                    )}
                </div>
                <div className="flex items-center justify-end">
                    <LoginLogoutButton
                        currentScreenMuteerOmgeving={location.pathname.includes(
                            'muteer'
                        )}
                        setLoginState={setLoginState}
                        loggedIn={loggedIn}
                    />
                </div>
            </div>
        </nav>
    )
}

export default Navigation
