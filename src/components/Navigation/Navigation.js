import React from "react"
import { Link, useLocation } from "react-router-dom"
import isToday from "date-fns/isToday"
import parseISO from "date-fns/parseISO"

import { faEye, faSignInAlt } from "@fortawesome/pro-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import NavigationPopupMenu from "./../NavigationPopupMenu"
import NetworkGraph from "./../NetworkGraph"
import SearchBar from "./../SearchBar"
import BannerEnvironment from "./../BannerEnvironment"

import GraphContext from "./../../App/GraphContext"

import logoSVG from "./../../images/PZH_Basislogo.svg"
import useBanner from "../../utils/useBanner"

/**
 * Displays a navbar on top of the page which the user can use to login, logout and search within the omgevingsbeleid.
 *
 * @param {boolean} loggedIn - Parameter that is set true if user is logged in.
 * @param {function} setLoginState - Function to edit parent state.
 */
function Navigation({ loggedIn, setLoginState }) {
    const location = useLocation()
    const pathname = location.pathname
    const userIsInMuteerEnvironment = pathname.includes("/muteer/")

    // State for popup menu
    const [isOpen, setIsOpen] = React.useState(false)
    const { graphIsOpen, setGraphIsOpen } = React.useContext(GraphContext)
    const { locationEqualsMutateEnv } = useBanner(graphIsOpen)

    // If the user removes the banner a variable gets set in Local Storage.
    // This variable is valid for 24 hours and makes sure the banner will not show up again.
    const hideBannerLocalStorage = () => {
        const dateHideBanner = localStorage.getItem("__OB_hide_banner__")
        return isToday(
            typeof dateHideBanner === "string"
                ? parseISO(dateHideBanner)
                : dateHideBanner
        )
    }

    /**
     * Function to logout the user.
     *
     * @function
     */
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
                locationEqualsMutateEnv ? "" : "shadow-navigation"
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
                        to={loggedIn ? "/muteer/dashboard" : "/"}
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
                            componentInNavbar={true}
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
                            screenReaderLabel="Login"
                        />
                    ) : null}

                    <NetworkGraph
                        graphIsOpen={graphIsOpen}
                        setGraphIsOpen={setGraphIsOpen}
                        showBanner={showBanner}
                    />

                    <NavigationPopupMenu
                        showBanner={showBanner}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                </div>
            </div>
        </nav>
    )
}

const MenuIcon = ({
    to,
    icon,
    className,
    setIsOpen,
    screenReaderLabel,
    children = null,
}) => {
    return (
        <Link
            to={to}
            className="flex items-center justify-center px-2 py-2 text-gray-800 transition duration-300 ease-in rounded hover:text-gray-800"
            onClick={() => {
                setIsOpen(false)
            }}
        >
            <span>
                <FontAwesomeIcon
                    className={`${className} text-sm`}
                    icon={icon}
                />
                <span className="sr-only">{screenReaderLabel}</span>
            </span>
            <div className="text-sm">{children}</div>
        </Link>
    )
}

/**
 * Function to display the PZH logo.
 *
 * @function
 */
function Logo() {
    return (
        <img
            className="inline-block"
            title="Provincie Zuid-Holland Logo"
            style={{ height: "96px" }}
            src={logoSVG}
            alt="Provincie Zuid-Holland Logo"
        />
    )
}

export default Navigation
