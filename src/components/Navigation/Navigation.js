import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import isToday from 'date-fns/isToday'
import parseISO from 'date-fns/parseISO'

import {
    faSearch,
    faBars,
    faTimes,
    faEye,
    faSignInAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Import API and Env variable used for the banner
import axios, { environment } from './../../API/axios'

// Import dimension variables
import allDimensies from './../../constants/dimensies'

// Import useLockBodyScroll to stop html body scroll when the modal is open
import useLockBodyScroll from './../../utils/useLockBodyScroll'

import Transition from './../Transition'
import LoaderSpinner from './../LoaderSpinner'
import SearchBar from './../SearchBar'

function Navigation({ loggedIn, setLoginState }) {
    const location = useLocation()
    const pathname = location.pathname
    const userIsInMuteerEnvironment = pathname.includes('/muteer/')

    // State for popup menu
    const [isOpen, setIsOpen] = React.useState(false)

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
        <nav className="fixed top-0 z-20 w-full bg-white" id="navigation-main">
            {/* Banner that displays the current environment */}
            <BannerEnvironment
                hideBannerLocalStorage={hideBannerLocalStorage}
                userIsInMuteerEnvironment={userIsInMuteerEnvironment}
            />

            {/* Main container */}
            <div className="container flex flex-wrap items-center justify-between py-4 mx-auto bg-white border-b border-gray-200 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center py-2 mr-6 text-black flex-no-shrink">
                    <Link
                        id="href-naar-home"
                        to={loggedIn ? '/muteer/dashboard' : '/'}
                        className="z-10 text-blue focus:border-primary"
                        onClick={() => {
                            setIsOpen(false)
                        }}
                    >
                        <Logo />
                    </Link>
                </div>

                {/* Searchbar if user is not on the homepage */}
                {location.pathname !== '/' ? (
                    <div className="absolute" style={{ marginLeft: '350px' }}>
                        <SearchBar width="w-64" compInNavigation={true} />
                    </div>
                ) : null}

                {/* Buttons to toggle popup menu */}
                <div className="flex items-center justify-end">
                    {loggedIn && userIsInMuteerEnvironment ? (
                        <Link
                            to={'/'}
                            className="px-4 py-2 mr-5 text-sm text-gray-700 transition duration-300 ease-in rounded hover:text-gray-800"
                            onClick={() => {
                                setIsOpen(false)
                            }}
                        >
                            <FontAwesomeIcon className="mr-3" icon={faEye} />
                            Raadplegen
                        </Link>
                    ) : null}
                    {loggedIn && !userIsInMuteerEnvironment ? (
                        <Link
                            to={'/muteer/dashboard'}
                            className="px-4 py-2 mr-5 text-sm text-gray-700 transition duration-300 ease-in rounded hover:text-gray-800"
                            onClick={() => {
                                setIsOpen(false)
                            }}
                        >
                            <FontAwesomeIcon className="mr-3" icon={faEye} />
                            Bewerken
                        </Link>
                    ) : null}
                    {!loggedIn ? (
                        <Link
                            to={'/login'}
                            className="px-4 py-2 mr-5 text-sm text-gray-700 transition duration-300 ease-in rounded hover:text-gray-800"
                            onClick={() => {
                                setIsOpen(false)
                            }}
                        >
                            <FontAwesomeIcon
                                className="mr-3"
                                icon={faSignInAlt}
                            />
                            Inloggen
                        </Link>
                    ) : null}
                    <PopupMenu
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

const PopupMenu = ({ loggedIn, showBanner, logout, isOpen, setIsOpen }) => {
    // Popup state
    const [activeTab, setActiveTab] = React.useState('Ambities')
    const [filterQuery, setFilterQuery] = React.useState('')

    // Loading state
    const [isLoading, setIsLoading] = React.useState(true)
    const [verordeningIsLoading, setVerordeningIsLoading] = React.useState(true)

    // Dimension state
    const [ambities, setAmbities] = React.useState(null)
    const [opgaven, setOpgaven] = React.useState(null)
    const [beleidskeuzes, setBeleidskeuzes] = React.useState(null)
    const [maatregelen, setMaatregelen] = React.useState(null)
    const [beleidsregels, setBeleidsregels] = React.useState(null)
    const [verordeningStructuur, setVerordeningStructuur] = React.useState(null)

    // On mount get dimension data from API
    React.useEffect(() => {
        Promise.all([
            axios
                .get(`${allDimensies.AMBITIES.API_ENDPOINT}`)
                .then((res) => setAmbities(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.OPGAVEN.API_ENDPOINT}`)
                .then((res) => setOpgaven(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(
                    `${allDimensies.BELEIDSBESLISSINGEN.API_ENDPOINT}?Status=Vigerend`
                )
                .then((res) => setBeleidskeuzes(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.BELEIDSREGELS.API_ENDPOINT}`)
                .then((res) => setBeleidsregels(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.MAATREGELEN.API_ENDPOINT}`)
                .then((res) => setMaatregelen(res.data))
                .catch((err) => console.log(err)),
            axios
                .get(`${allDimensies.VERORDENINGSTRUCTUUR.API_ENDPOINT}`)
                .then((res) => {
                    // Generate the URL for the first item of the lineage
                    const firstLineage = res.data[0]
                    // Used to push in the levels until we find an 'Artikel
                    let position = []

                    // TODO: Fix bug when there is no article in the first [0][0][0]
                    const traverseItems = (children) => {
                        if (children[0] && children[0].Type !== 'Artikel') {
                            position.push(0)
                            return traverseItems(children[0].Children)
                        } else {
                            return children[0]
                        }
                    }

                    let firstArtikel = traverseItems(
                        firstLineage.Structuur.Children
                    )
                    const generateURL = (position, firstArtikel) => {
                        if (position.length === 1) {
                            return `/detail/verordeningen/${firstLineage.ID}/${firstArtikel.UUID}?hoofdstuk=0&nest_1=0&nest_2=null&nest_3=null`
                        } else if (position.length === 2) {
                            return `/detail/verordeningen/${firstLineage.ID}/${firstArtikel.UUID}?hoofdstuk=0&nest_1=0&nest_2=0&nest_3=null`
                        } else if (position.length === 3) {
                            return `/detail/verordeningen/${firstLineage.ID}/${firstArtikel.UUID}?hoofdstuk=0&nest_1=0&nest_2=0&nest_3=0`
                        }
                    }
                    setVerordeningStructuur(generateURL(position, firstArtikel))
                    setVerordeningIsLoading(false)
                })
                .catch((err) => console.log(err)),
        ]).then(() => setIsLoading(false))
    }, [])

    const getCurrentConstants = () => {
        switch (activeTab) {
            case 'Ambities':
                return allDimensies['AMBITIES']
            case 'Opgaven':
                return allDimensies['OPGAVEN']
            case 'Beleidsbeslissingen':
                return allDimensies['BELEIDSBESLISSINGEN']
            case "Maatregelen (Programma's)":
                return allDimensies['MAATREGELEN']
            case 'Beleidsregels':
                return allDimensies['BELEIDSREGELS']

            default:
                return {}
        }
    }

    const getCurrentItems = () => {
        switch (activeTab) {
            case 'Ambities':
                return ambities
            case 'Opgaven':
                return opgaven
            case 'Beleidsbeslissingen':
                return beleidskeuzes
            case "Maatregelen (Programma's)":
                return maatregelen
            case 'Beleidsregels':
                return beleidsregels

            default:
                return {}
        }
    }

    // If the modal is open we lock the HTML body scroll
    useLockBodyScroll({ modalOpen: isOpen })

    // Eventlistener for closing the modal with the Escape key
    React.useEffect(() => {
        function closeOnEscape(e) {
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', closeOnEscape)
        return () => window.removeEventListener('keydown', closeOnEscape)
    }, [])

    const currentItems = getCurrentItems()

    return (
        <React.Fragment>
            <button
                className="px-4 py-2 ml-6 font-semibold text-white rounded bg-primary"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FontAwesomeIcon
                    className="mr-4 text-sm"
                    icon={isOpen ? faTimes : faBars}
                />
                {isOpen ? 'Menu sluiten' : 'Menu'}
            </button>
            <Transition
                show={isOpen}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95 -translate-y-5 transform"
                enterTo="opacity-100 scale-100 translate-y-0 transform"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100 translate-y-0 transform"
                leaveTo="opacity-0 scale-95 -translate-y-5 transform"
            >
                <div
                    className="fixed top-0 left-0 w-full pt-24 bg-white"
                    style={
                        showBanner
                            ? {
                                  height: 'calc(100vh - 73px)',
                                  top: '121px',
                              }
                            : {
                                  height: 'calc(100vh - 73px)',
                                  top: '73px',
                              }
                    }
                >
                    <div className="container flex h-full px-6 mx-auto">
                        <div className="w-3/12 h-full border-r border-gray-300">
                            <h3 className="font-bold text-gray-900 heading-xl">
                                Omgevingsvisie
                            </h3>
                            <nav className="mt-5">
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Ambities"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Opgaven"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Beleidsbeslissingen"
                                    setActiveTab={setActiveTab}
                                />
                            </nav>
                            <h3 className="mt-16 font-bold text-gray-900 heading-xl">
                                Uitvoering
                            </h3>
                            <nav className="mt-5">
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Maatregelen (Programma's)"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItem
                                    activeTab={activeTab}
                                    tabTitle="Beleidsregels"
                                    setActiveTab={setActiveTab}
                                />
                                <TabMenuItemLink
                                    href={
                                        isLoading ? '#' : verordeningStructuur
                                    }
                                    tabId={`popup-menu-item-Verordening`}
                                    tabTitle="Verordening"
                                    setIsOpen={setIsOpen}
                                />
                            </nav>
                        </div>
                        <div className="flex flex-col w-9/12 pl-5">
                            <div className="flex w-full pb-5 border-b border-gray-300">
                                <h3 className="w-full font-bold text-gray-900 heading-xl">
                                    {activeTab}{' '}
                                    {isLoading &&
                                    verordeningIsLoading ? null : (
                                        <span className="ml-2 text-gray-600">
                                            {currentItems !== null
                                                ? currentItems.filter((item) =>
                                                      item.Titel.toLowerCase().includes(
                                                          filterQuery.toLowerCase()
                                                      )
                                                  ).length
                                                : null}
                                        </span>
                                    )}
                                </h3>
                                <div>
                                    <label for="filter-query" class="sr-only">
                                        Filter
                                    </label>
                                    <div class="w-64 mt-1 relative rounded-md shadow-sm">
                                        <input
                                            id="filter-query"
                                            value={filterQuery}
                                            onChange={(e) =>
                                                setFilterQuery(e.target.value)
                                            }
                                            class="form-input block w-full pr-10 sm:text-sm sm:leading-5"
                                            placeholder={`Zoek in ${getCurrentConstants().TITEL_MEERVOUD.toLowerCase()}`}
                                        />
                                        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon
                                                className="ml-2 text-gray-400"
                                                icon={faSearch}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-full pt-2 overflow-y-auto">
                                <nav className="flex flex-wrap pb-12 items-top">
                                    {isLoading && !currentItems ? (
                                        <div className="flex items-center justify-center w-full h-24 text-gray-500">
                                            <LoaderSpinner />
                                        </div>
                                    ) : (
                                        currentItems
                                            .filter((item) =>
                                                item.Titel.toLowerCase().includes(
                                                    filterQuery.toLowerCase()
                                                )
                                            )
                                            .sort(function (a, b) {
                                                if (a.Titel < b.Titel) {
                                                    return -1
                                                }
                                                if (a.Titel > b.Titel) {
                                                    return 1
                                                }
                                                return 0
                                            })
                                            .map((item, index) => (
                                                <Link
                                                    className={`w-1/2 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150 py-1 text-gray-700 hover:text-gray-900  inline-block ${
                                                        index % 2 === 0
                                                            ? 'pr-4'
                                                            : 'pl-4'
                                                    }`}
                                                    onClick={() =>
                                                        setIsOpen(false)
                                                    }
                                                    to={`/detail/${
                                                        getCurrentConstants()
                                                            .SLUG_OVERZICHT
                                                    }/${item.UUID}`}
                                                >
                                                    {item.Titel}
                                                </Link>
                                            ))
                                    )}
                                    {!isLoading &&
                                    currentItems &&
                                    currentItems.filter((item) =>
                                        item.Titel.toLowerCase().includes(
                                            filterQuery.toLowerCase()
                                        )
                                    ).length === 0 ? (
                                        <span
                                            className="px-3 mt-2 text-gray-500 cursor-pointer hover:text-gray-700 text-italic"
                                            onClick={() => {
                                                setFilterQuery('')
                                                document
                                                    .getElementById(
                                                        'filter-query'
                                                    )
                                                    .focus()
                                            }}
                                        >
                                            Er zijn geen resultaten
                                        </span>
                                    ) : null}
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </React.Fragment>
    )
}

const TabMenuItem = ({ activeTab, tabTitle, setActiveTab }) => {
    const tabIsActive = activeTab === tabTitle

    return (
        <button
            onClick={() => setActiveTab(tabTitle)}
            id={`popup-menu-item-${tabTitle}`}
            className={`w-full font-medium rounded-md-l group flex items-center px-3 py-2 text-sm leading-5 hover:text-gray-900 transition ease-in-out duration-150 mt-1 ${
                tabIsActive
                    ? 'text-gray-900 bg-gray-100 hover:bg-gray-50 focus:outline-none'
                    : 'text-gray-600 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer'
            }`}
            aria-current={tabIsActive ? 'page' : false}
        >
            <span class="truncate">{tabTitle}</span>
        </button>
    )
}

const TabMenuItemLink = ({ tabTitle, href, setIsOpen, tabId, callback }) => {
    return (
        <Link
            id={tabId}
            onClick={() => {
                setIsOpen(false)
                if (callback) callback()
            }}
            to={href}
            className={`w-full font-medium rounded-md-l group flex items-center px-3 py-2 text-sm leading-5 hover:text-gray-900 transition ease-in-out duration-150 mt-1 text-gray-600 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 cursor-pointer`}
        >
            <span class="truncate">{tabTitle}</span>
        </Link>
    )
}

function Logo() {
    return (
        <React.Fragment>
            <div className="logo-beeldmerk" />
            <div className="logo-tekst" />
            {/* Beta Badge */}
            <div className="absolute px-1 pl-4 ml-64 -mt-4">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold leading-4 beta-logo text-yellow-700 uppercase">
                    Beta
                </span>
            </div>
        </React.Fragment>
    )
}

function BannerEnvironment({
    userIsInMuteerEnvironment,
    hideBannerLocalStorage,
}) {
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
        <div className={`relative ${getEnvironmentCSSClass()}`}>
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
