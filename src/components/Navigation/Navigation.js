import React, { Component } from 'react'
import { Link, useLocation } from 'react-router-dom'
import isToday from 'date-fns/is_today'

import { faCaretDown, faSignInAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { environment } from './../../API/axios'

// function getToken() {
//     return localStorage.getItem('access_token')
// }

function logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('__OB_access_token__')
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

    handleClick = (e) => {
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
        let identifier = localStorage.getItem('__OB_identifier__')
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

function LoginLogoutButton({
    loggedIn,
    currentScreenMuteerOmgeving,
    setLoginState,
}) {
    if (loggedIn) {
        return (
            <NavigationMenuPopUp
                currentScreenMuteerOmgeving={currentScreenMuteerOmgeving}
                setLoginState={setLoginState}
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
            <div className="absolute px-1 pl-4 ml-64 -mt-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold leading-4 beta-logo text-yellow-700 uppercase">
                    Beta
                </span>
            </div>
        </React.Fragment>
    )
}

function BannerEnvironment() {
    const location = useLocation()
    const pathname = location.pathname
    const userIsInMuteerEnvironment = pathname.includes('/muteer/')

    const getEnivronmentText = () => {
        switch (environment) {
            case 'dev':
                return 'Ontwikkelomgeving'
            case 'test':
                return 'Testomgeving'
            case 'acc':
                return 'Acceptatieomgeving'
            case 'prod':
                return 'Live-omgeving'
        }
    }

    // If the user removes the banner a variable gets set in Local Storage.
    // This variable is valid for 24 hours and makes sure the banner will not show up again.
    const hideBannerLocalStorage = () => {
        const dateHideBanner = localStorage.getItem('__OB_hide_banner__')
        console.log(dateHideBanner)
        console.log(isToday(dateHideBanner))
        return isToday(dateHideBanner)
    }

    const [showBanner, setShowBanner] = React.useState(
        userIsInMuteerEnvironment && !hideBannerLocalStorage()
    )

    React.useEffect(() => {
        if (!hideBannerLocalStorage()) {
            addMarginTop()
        }
    }, [])

    React.useEffect(() => {
        if (userIsInMuteerEnvironment && !hideBannerLocalStorage()) {
            addBanner()
        } else {
            removeBanner()
        }
    }, [userIsInMuteerEnvironment])

    const removeBanner = () => {
        const mainContainer = document.getElementById('main-container')
        mainContainer.style.removeProperty('margin-top')
        setShowBanner(false)
    }

    const addBanner = () => {
        addMarginTop()
        setShowBanner(true)
    }

    const setHideBannerLocalStorage = () => {
        localStorage.setItem('__OB_hide_banner__', new Date())
    }

    const addMarginTop = () => {
        const mainContainer = document.getElementById('main-container')
        console.log('CALLED')
        console.log(mainContainer)
        mainContainer.style.marginTop = '118px'
    }

    const getEnvironmentCSSClass = () => {
        switch (environment) {
            case 'dev':
                return 'banner-dev'
            case 'test':
                return 'banner-test'
            case 'acc':
                return 'banner-acc'
            case 'prod':
                return 'banner-prod'
        }
    }

    if (!showBanner) return null

    return (
        <div class={`relative ${getEnvironmentCSSClass()}`}>
            <div className="max-w-screen-xl px-3 py-3 mx-auto sm:px-6 lg:px-8">
                <div className="pr-16 sm:text-center sm:px-16">
                    <p className="font-medium">
                        <span className="text-sm font-semibold leading-4 tracking-wider uppercase rounded hide-banner">
                            {getEnivronmentText()}
                        </span>
                    </p>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
                    <button
                        type="button"
                        className="flex p-2 transition duration-150 ease-in-out rounded-lg focus:outline-none hide-banner"
                        onClick={() => {
                            setShowBanner(!showBanner)
                            removeBanner()
                            setHideBannerLocalStorage()
                        }}
                    >
                        <svg
                            className="w-6 h-6"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

function Navigation({ loggedIn, setLoginState }) {
    const location = useLocation()
    return (
        <nav className="fixed top-0 z-20 w-full bg-white" id="navigation-main">
            <BannerEnvironment />
            <div className="container flex flex-wrap items-center justify-between py-6 mx-auto bg-white border-b border-gray-200 sm:px-6 lg:px-8">
                <div className="flex items-center py-2 mr-6 text-black flex-no-shrink">
                    {loggedIn ? (
                        <Link
                            id="href-naar-home"
                            to={`/muteer/dashboard`}
                            className="text-blue"
                        >
                            <Logo />
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
