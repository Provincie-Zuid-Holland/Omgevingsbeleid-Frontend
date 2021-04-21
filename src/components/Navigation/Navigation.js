import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import isToday from 'date-fns/isToday'
import parseISO from 'date-fns/parseISO'

import { faEye, faSignInAlt } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import API and Env variable used for the banner
import { environment } from './../../API/axios'

import NavigationPopupMenu from './../NavigationPopupMenu'
import GraphPopupMenu from './../GraphPopupMenu'
import SearchBar from './../SearchBar'

import logoSVG from './../../images/PZH_Basislogo.svg'

function Navigation({ loggedIn, setLoginState }) {
    const location = useLocation()
    const pathname = location.pathname
    const userIsInMuteerEnvironment = pathname.includes('/muteer/')

    // State for popup menu
    const [graphIsOpen, setGraphIsOpen] = React.useState(false)
    const [isOpen, setIsOpen] = React.useState(false)
    const [
        locationEqualsMutateEnv,
        setLocationEqualsMutateEnv,
    ] = React.useState(false)

    React.useEffect(() => {
        const userIsInMuteer =
            pathname.includes('muteer') || pathname.includes('login')
        setLocationEqualsMutateEnv(userIsInMuteer)
    }, [pathname])

    React.useEffect(() => {
        const header = document.getElementById('navigation-main')
        const doc = document.documentElement
        const w = window

        let prevScroll = w.scrollY || doc.scrollTop
        let prevDirection = 0
        let direction = 0
        let curScroll

        const checkScroll = () => {
            /*
             ** Find the direction of scroll
             ** 0 - initial, 1 - up, 2 - down
             */

            curScroll = w.scrollY || doc.scrollTop
            if (curScroll > prevScroll) {
                //scrolled up
                direction = 2
            } else if (curScroll < prevScroll) {
                //scrolled down
                direction = 1
            }

            if (direction !== prevDirection) {
                toggleHeader(direction, curScroll)
            }

            toggleShadow(curScroll)

            prevScroll = curScroll
        }

        const toggleShadow = (currScroll) => {
            // If user is in the muteer environment we don't want to show a shadow
            if (locationEqualsMutateEnv) return

            if (currScroll > 94) {
                header.classList.add('soft-shadow-navigation')
                header.classList.remove('shadow-navigation')
            } else if (currScroll < 94) {
                if (!header.classList.contains('shadow-navigation')) {
                    header.classList.remove('soft-shadow-navigation')
                    header.classList.add('shadow-navigation')
                }
            } else if (!header.classList.contains('shadow-navigation')) {
                header.classList.remove('soft-shadow-navigation')
                header.classList.add('shadow-navigation')
            }
        }

        const toggleHeader = (direction, curScroll) => {
            if (direction === 2 && curScroll > 94) {
                header.classList.add('hide-nav')
                prevDirection = direction
            } else if (direction === 1) {
                header.classList.remove('hide-nav')
                prevDirection = direction
            }
        }

        window.addEventListener('scroll', checkScroll)

        return () => {
            window.removeEventListener('scroll', checkScroll)
        }
    }, [locationEqualsMutateEnv])

    // If the user removes the banner a variable gets set in Local Storage.
    // This variable is valid for 24 hours and makes sure the banner will not show up again.
    const hideBannerLocalStorage = () => {
        const dateHideBanner = localStorage.getItem('__OB_hide_banner__')
        return isToday(
            typeof dateHideBanner === 'string'
                ? parseISO(dateHideBanner)
                : dateHideBanner
        )
    }

    function logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem(process.env.REACT_APP_KEY_API_ACCESS_TOKEN)
        localStorage.removeItem(process.env.REACT_APP_KEY_IDENTIFIER)

        setLoginState(false)
    }

    const showBanner = userIsInMuteerEnvironment && !hideBannerLocalStorage()

    return (
        <nav
            className={`fixed top-0 z-20 w-full transition-all duration-200 ease-in bg-white ${
                locationEqualsMutateEnv ? '' : 'shadow-navigation'
            }`}
            id="navigation-main"
        >
            {/* Banner that displays the current environment */}
            <BannerEnvironment
                hideBannerLocalStorage={hideBannerLocalStorage}
                userIsInMuteerEnvironment={userIsInMuteerEnvironment}
            />

            {/* Main container */}
            <div className="container flex flex-wrap items-center justify-between px-4 mx-auto bg-white">
                {/* Logo */}
                <div className="flex items-center mr-6 text-black flex-no-shrink">
                    <Link
                        id="href-naar-home"
                        to={loggedIn ? '/muteer/dashboard' : '/'}
                        className="z-10 ml-3 sm:ml-0"
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        <Logo />
                    </Link>
                </div>

                {/* Buttons to toggle popup menu */}
                <div className="flex items-center justify-end">
                    <div className="hidden mr-5 md:inline-block">
                        <SearchBar
                            width="w-64"
                            placeholder="Zoek in het omgevingsbeleid"
                            compInNavigation={true}
                        />
                    </div>
                    {loggedIn && userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/"
                            icon={faEye}
                            className="mr-3"
                            children="Raadplegen"
                        />
                    ) : null}
                    {loggedIn && !userIsInMuteerEnvironment ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/muteer/dashboard"
                            icon={faEye}
                            className="mr-3"
                            children="Bewerken"
                        />
                    ) : null}

                    {!loggedIn ? (
                        <MenuIcon
                            setIsOpen={setIsOpen}
                            to="/login"
                            icon={faSignInAlt}
                            className="mx-1"
                        />
                    ) : null}

                    <GraphPopupMenu
                        graphIsOpen={graphIsOpen}
                        setGraphIsOpen={setGraphIsOpen}
                        showBanner={showBanner}
                    />

                    <NavigationPopupMenu
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        logout={logout}
                        setLoginState={setLoginState}
                        loggedIn={loggedIn}
                        showBanner={showBanner}
                    />
                </div>
            </div>
        </nav>
    )
}

const MenuIcon = ({ to, icon, className, setIsOpen, children = null }) => {
    return (
        <Link
            to={to}
            className="flex items-center justify-center px-2 py-2 text-gray-800 transition duration-300 ease-in rounded hover:text-gray-800"
            onClick={() => {
                setIsOpen(false)
            }}
        >
            <FontAwesomeIcon className={`${className} text-sm`} icon={icon} />
            <div className="mt-1 text-sm">{children}</div>
        </Link>
    )
}

function Logo() {
    return (
        <img
            className="inline-block"
            title="Provincie Zuid-Holland Logo"
            style={{ height: '96px' }}
            src={logoSVG}
            alt="Provincie Zuid-Holland Logo"
        />
    )
}

function BannerEnvironment({
    userIsInMuteerEnvironment,
    hideBannerLocalStorage,
}) {
    const getEnvironmentText = () => {
        switch (environment) {
            case 'dev':
                return 'Ontwikkelomgeving'
            case 'test':
                return 'Testomgeving'
            case 'acc':
                return 'Acceptatieomgeving'
            case 'prod':
                return 'Live-omgeving'
            default:
                return 'No environment set'
        }
    }

    const [showBanner, setShowBanner] = React.useState(
        userIsInMuteerEnvironment && !hideBannerLocalStorage()
    )

    React.useEffect(() => {
        // Check
        if (!hideBannerLocalStorage()) {
            addMarginTop()
        }
    }, [hideBannerLocalStorage])

    const removeBanner = React.useCallback(() => {
        const mainContainer = document.getElementById('main-container')
        mainContainer.style.removeProperty('margin-top')
        setShowBanner(false)
    }, [])

    const addBanner = React.useCallback(() => {
        addMarginTop()
        setShowBanner(true)
    }, [])

    React.useEffect(() => {
        if (userIsInMuteerEnvironment && !hideBannerLocalStorage()) {
            addBanner()
        } else {
            removeBanner()
        }
    }, [
        userIsInMuteerEnvironment,
        addBanner,
        removeBanner,
        hideBannerLocalStorage,
    ])

    const setHideBannerLocalStorage = () => {
        localStorage.setItem('__OB_hide_banner__', new Date())
    }

    const addMarginTop = () => {
        const mainContainer = document.getElementById('main-container')
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
            default:
                return 'banner-dev'
        }
    }

    if (!showBanner) return null

    return (
        <div className={`relative ${getEnvironmentCSSClass()}`}>
            <div className="max-w-screen-xl px-3 py-2 mx-auto sm:px-6 lg:px-8">
                <div className="pr-16 sm:text-center sm:px-16">
                    <p className="font-medium">
                        <span className="text-sm font-bold leading-4 tracking-wider uppercase rounded hide-banner">
                            {getEnvironmentText()}
                        </span>
                    </p>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-start pt-1 pr-1 sm:pt-1 sm:pr-2 sm:items-start">
                    <button
                        type="button"
                        className="flex p-1 transition duration-150 ease-in-out rounded-lg focus:outline-none hide-banner"
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
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navigation
